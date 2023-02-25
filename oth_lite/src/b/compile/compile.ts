
import { Const, XOp, Exp, Pattern, FRange, Stmt } from "z/parse/parser"

function compPrim(f: string, el: Exp[]): string | null {
	switch (f) {
		case 'add':
		case 'concat':
			return compExp(el[0]) + " + " + compExp(el[1]);
		case 'sub':
			return compExp(el[0]) + " - " + compExp(el[1]);
		case 'mul':
			return compExp(el[0]) + " * " + compExp(el[1]);
		case 'lt':
			return compExp(el[0]) + " < " + compExp(el[1]);
		case 'leq':
			return compExp(el[0]) + " <= " + compExp(el[1]);
		case 'gt':
			return compExp(el[0]) + " > " + compExp(el[1]);
		case 'geq':
			return compExp(el[0]) + " >= " + compExp(el[1]);
		case 'neq':
			return compExp(el[0]) + " !== " + compExp(el[1]);
		case 'equals':
			return compExp(el[0]) + " === " + compExp(el[1]);
		case 'and':
			return compExp(el[0]) + " && " + compExp(el[1]);
		case 'or':
			return compExp(el[0]) + " || " + compExp(el[1]);
	}
	return null;
}

function compOp(o: XOp, el: Exp[]): string {
	switch (o.op) {
		case 'index':
			if (o.rw === 'r') return compExp(el[0]) + "[" + compExp(el[1]) + "]";
			return compExp(el[0]) + "[" + compExp(el[1]) + "] = " + compExp(el[2]);
		case 'field':
			if (o.rw === 'r') return compExp(el[0]) + "." + o.x;
			return compExp(el[0]) + "." + o.x + " = " + compExp(el[1]);
		case 'elem':
			return compExp(el[0]) + "[" + o.i + "]";
		case 'unpack':
			return compExp(el[0]);
	}
}

function escapeStr(s: string): string {
	var t = "";
	for (let j = 0; j < s.length; j++) {
		var i = s.charCodeAt(j);
		switch (i) {
			case 10: t = t + '\\n'; break;
			case 11: t = t + '\\t'; break;
			case 15: t = t + '\\r'; break;
			case 34: t = t + '\\"'; break;
			case 92: t = t + '\\\\'; break;
			default:
				if (i >= 32 && i <= 126) t = t + s.charAt(j);
				else if (i >= 0 && i <= 9) t = t + '\\u000' + i;
				else if (i >= 10 && i <= 99) t = t + '\\u00' + i;
				else if (i >= 100 && i <= 999) t = t + '\\u0' + i;
				else t = t + '\\u' + i;
		}
	}
	return t;
}

function compConst(c: Const): string {
	switch (c.const) {
		case 'int':
			return "" + c.i;
		case 'float':
			return "" + c.f;
		case 'bool':
			if (c.b) return "true";
			return "false";
		case 'string':
			return '\"' + escapeStr(c.s) + '\"';
	}
}

function compExp(e: Exp): string {
	switch (e.exp) {
		case 'const':
			return compConst(e.c);
		case 'op':
			throw("BUG: eval.js - Special operator found in non-applicative position.");
		case 'var':
			return "__" + e.x;
		case 'app':
			if (e.e.exp === 'var') {
				var pCode = compPrim(e.e.x, e.el);
				if (pCode !== null) return "(" + pCode + ")";
			} else if (e.e.exp === 'op') {
				return compOp(e.e.o, e.el);
			}
			var cCode = compExp(e.e) + "(";
			for (let i = 0; i < e.el.length; i++) {
				if (i !== 0) cCode = cCode + ", ";
				cCode = cCode + compExp(e.el[i]);
			}
			return cCode + ")";
		case 'is':
			return "(__" + e.x + "[0] === \"" + e.xt + "\")";
		case 'tuple':
			var sCode = "[null";
			for (let i = 0; i < e.el.length; i++) {
				sCode = sCode + ", " + compExp(e.el[i]);
			}
			return sCode + "]";
		case 'tag':
			var sCode = "[\"" + e.x + "\"";
			for (let i = 0; i < e.el.length; i++) {
				sCode = sCode + ", " + compExp(e.el[i]);
			}
			return sCode + "]";
		case 'struct':
			var sCode = "__newStruct([";
			for (let i = 0; i < e.fl.length; i++) {
				var [x, ex] = e.fl[i];
				if (i !== 0) sCode = sCode + ", ";
				sCode = sCode + "[\"" + x + "\", " + compExp(ex) + "]";
			}
			return sCode + "])";
		case 'array':
			var sCode = "__newArray([";
			for (let i = 0; i < e.el.length; i++) {
				var ex = e.el[i];
				if (i !== 0) sCode = sCode + ", ";
				sCode = sCode + compExp(ex);
			}
			return sCode + "])";
		case 'fun':
			var fCode = "function";
			if (e.f !== null) fCode = fCode + " __" + e.f;
			fCode = fCode + "(";
			for (let i = 0; i < e.xl.length; i++) {
				if (i !== 0) fCode = fCode + ", ";
				fCode = fCode + "__" + e.xl[i];
			}
			fCode = fCode + ") {\n";
			return fCode + compBody(e.body) + "\n}";
	}
}

function compPat(p: Pattern): string {
	switch (p.pat) {
		case 'blank':
			return "_";
		case 'id':
			return "__" + p.x;
		case 'tuple':
			var pCode = "[_, ";
			for (let i = 0; i < p.pl.length; i++) {
				if (i !== 0) pCode = pCode + ", ";
				pCode = pCode + compPat(p.pl[i]);
			}
			return pCode + "]";
	}
}
function compRange(r: FRange): string {
	switch (r.range) {
		case 'int':
			return "let __" + r.x + " = " + compExp(r.e1) + "; __" + r.x + " <= " + compExp(r.e2) + "; __" + r.x + "++";
		case 'exp':
			return "let " + compPat(r.p) + " of " + compExp(r.e);
	}
}

export function compStmt(s: Stmt): string {
	switch (s.stmt) {
		case 'eval':
			return compExp(s.e);
		case 'var':
			return "var " + compPat(s.p) + " = " + compExp(s.e);
		case 'assign':
			return "__" + s.x + " = " + compExp(s.e);
		case 'cond':
			var brCode = "";
			for (let i = 0; i < s.brList.length; i++) {
				var br = s.brList[i];
				if (i !== 0) brCode = brCode + " else ";
				brCode = brCode + "if (" + compExp(br.e) + ") {\n";
				brCode = brCode + compBody(br.body) + "\n}";
			}
			if (s.elseBody !== null) {
				brCode = brCode + " else {\n";
				brCode = brCode + compBody(s.elseBody) +"\n}";
			}
			return brCode;
		case 'while':
			var loopCode = "while (" + compExp(s.e) + ") {\n";
			loopCode = loopCode + compBody(s.body) + "\n}";
			return loopCode;
		case 'for':
			var fCode = "for (" + compRange(s.r) + ") {\n";
			return fCode + compBody(s.body) + "\n}";
		case 'return':
			if (s.e === null) return "return";
			return "return " + compExp(s.e);
	}
}

export function compBody(sl: Stmt[]): string {
	var bodyCode = "";
	for (let i = 0; i < sl.length; i++) {
		if (i !== 0) bodyCode = bodyCode + "\n";
		bodyCode = bodyCode + compStmt(sl[i]) + ";";
	}
	return bodyCode;
}