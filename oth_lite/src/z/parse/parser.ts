
import { VToken, LexPos } from "lexer"

type TokenList = VToken[]
type ParserFun<T> = (TokenList, number) => [number, T]

type IConst = { const: 'int', i: number }
type FConst = { const: 'float', f: number }
type SConst = { const: 'string', s: string }
type BConst = { const: 'bool', b: boolean }
export type Const = IConst | FConst | SConst | BConst

type IndexOp = { op: 'index', rw: 'r' | 'w' }
type FieldOp = { op: 'field', x: string, rw: 'r' | 'w' }
type ElemOp = { op: 'elem', i: number }
type UnpackOp = { op: 'unpack' }
export type XOp = IndexOp | FieldOp | ElemOp | UnpackOp

type ConstExp = { exp: 'const', c: Const, line: number }
type OpExp = { exp: 'op', o: XOp, line: number }
type VarExp = { exp: 'var', x: string, line: number }
type TupleExp = { exp: 'tuple', el: Exp[], line: number }
type IsExp = { exp: 'is', x: string, xt: string, line: number }
type TagExp = { exp: 'tag', x: string, el: Exp[], line: number }
type ArrayExp = { exp: 'array', el: Exp[], line: number }
type StructExp = { exp: 'struct', fl: [string, Exp][], line: number }
type FunExp = { exp: 'fun', f: string | null, xl: string[], body: Stmt[], line: number }
type AppExp = { exp: 'app', e: Exp, el: Exp[], line: number }
export type Exp = ConstExp | OpExp | VarExp | TupleExp | IsExp | TagExp | ArrayExp | StructExp | FunExp | AppExp

type BlankPat = { pat: 'blank' }
type IdPat = { pat: 'id', x: string }
export type SimpPat = BlankPat | IdPat
type TuplePat = { pat: 'tuple', pl: SimpPat[] }
export type Pattern = SimpPat | TuplePat

export type Branch = { e: Exp, body: Stmt[], line: number }

type IntRange = { range: 'int', x: string, e1: Exp, e2: Exp, i: number }
type ExpRange = { range: 'exp', p: Pattern, e: Exp }
export type FRange = IntRange | ExpRange

type EvalStmt = { stmt: 'eval', e: Exp, line: number }
type VarStmt = { stmt: 'var', p: Pattern, e: Exp, line: number }
type AssignStmt = { stmt: 'assign', x: string, e: Exp, line: number }
type CondStmt = { stmt: 'cond', brList: Branch[], elseBody: Stmt[] | null, line: number }
type WhileStmt = { stmt: 'while', e: Exp, body: Stmt[], line: number }
type ForStmt = { stmt: 'for', r: FRange, body: Stmt[], line: number }
type ReturnStmt = { stmt: 'return', e: Exp | null, line: number }
export type Stmt = EvalStmt | VarStmt | AssignStmt | CondStmt | WhileStmt | ForStmt | ReturnStmt

    /* system parse functions */

function parseError(desc: string, name: string, pos: LexPos): never
{
    throw('Parse error [' + desc + '] at line ' + (pos.line + 1) + ', column ' + (pos.col + 1) + ', on token: ' + name);
}

function parseErrorWeak(desc: string, line: number): never
{
    throw('Parse error [' + desc + '] at line ' + line);
}

function parseErrorBug(desc: string, name: string, pos: LexPos): never
{
    throw('BUG: parser.ts - Parse error [' + desc + '] at line ' + (pos.line + 1) + ', column ' + (pos.col + 1) + ', on token: ' + name);
}

function parseErrorOOB(desc: string): never
{
    throw('Parse error [' + desc + '] caused by end of file.');
}

    /* common parse functions / list combinators */

function parseToken(tokenList: TokenList, i: number, name: string, err: string): number
{
    if (i >= tokenList.length) parseErrorOOB(err);
    else if (tokenList[i].name === name) return i + 1;
    else parseError(err, tokenList[i].name, tokenList[i].pos);
}

function parseList<T>(f: ParserFun<T>, chk: (TokenList, number) => boolean): ParserFun<T[]>
{
    function plf(tokenList: TokenList, i: number): [number, T[]] {
        var ii = i;
        var tkList: T[] = [];
        while(ii < tokenList.length && chk(tokenList, ii)) {
            var [j, tk] = f(tokenList, ii);
            tkList.push(tk);
            ii = j;
        }
        return [ii, tkList];
    };
    return plf;
}

function parseSepList<T>(f: ParserFun<T>, sChk: (TokenList, number) => boolean): ParserFun<T[]>
{
    function plf(tokenList: TokenList, i: number): [number, T[]] {
        // parse the first exp
        var [j, tk0] = f(tokenList, i);
        var ii = j;
        var tkList: T[] = [tk0];
        // while the separator is valid
        while(ii < tokenList.length && sChk(tokenList, ii)) {
            // parse the next exp
            var [j, tk] = f(tokenList, ii + 1);
            tkList.push(tk);
            ii = j;
        }
        return [ii, tkList];
    };
    return plf;
}

function parseSepTail<T>(f: ParserFun<T>, sChk: (TokenList, number) => boolean): ParserFun<T[]>
{
    function plf(tokenList: TokenList, i: number): [number, T[]] {
        // parse the first exp
        var ii = i;
        var tkList: T[] = [];
        // while the separator is valid
        while(ii < tokenList.length && sChk(tokenList, ii)) {
            // parse the next exp
            var [j, tk] = f(tokenList, ii + 1);
            tkList.push(tk);
            ii = j;
        }
        return [ii, tkList];
    };
    return plf;
}

function parseSepListC<T, S>(f: ParserFun<T>, sChk: (TokenList, number) => S | null): ParserFun<[T, [T, S][]]>
{
    function plf(tokenList: TokenList, i: number): [number, [T, [T, S][]]] {
        // parse the first exp
        var [j, tk0] = f(tokenList, i);
        var ii = j;
        var tkList: [T, S][] = [];
        // parse the first separator
        var curSep: S | null = null;
        if (ii < tokenList.length) curSep = sChk(tokenList, ii);
        // while the separator is valid
        while(curSep !== null) {
            // parse the next exp
            var [j, tk] = f(tokenList, ii + 1);
            tkList.push([tk, curSep]);
            ii = j;
            // parse the next separator
            curSep = null
            if (ii < tokenList.length) curSep = sChk(tokenList, ii);
        }
        return [ii, [tk0, tkList]];
    };
    return plf;
}

    /* checks used for lists */

function isCommaCheck(tokenList: TokenList, i: number): boolean {
    return tokenList[i].name === 'comma';
}

function isLExtCheck(tokenList: TokenList, i: number): boolean {
    return tokenList[i].name === 'dot' || tokenList[i].name === 'lbrace';
}

function isFExtCheck(tokenList: TokenList, i: number): boolean {
    return tokenList[i].name === 'dot' || tokenList[i].name === 'lbrace' || tokenList[i].name === 'lparen';
}

function isElsifCheck(tokenList: TokenList, i: number): boolean {
	return tokenList[i].name === 'elsif';
}

function isCaseCheck(tokenList: TokenList, i: number): boolean {
	return tokenList[i].name === 'case';
}

function isSemiCCheck(tokenList: TokenList, i: number): boolean {
	return tokenList[i].name === 'semic';
}

function isNotRBrackCheck(tokenList: TokenList, i: number): boolean {
	return tokenList[i].name !== 'rbrack';
}

function sepLeftOpCheck(tokenList: TokenList, i: number): string | null  {
    if (tokenList[i].name !== 'xop') return null;
    switch (tokenList[i].value) {
        case '+': return 'add';
        case '-': return 'sub';
        case '*': return 'mul';
        case '/': return 'div';
        case '%': return 'mod';
        case '^': return 'concat';
        default: return null;
    }
}

function sepCompOpCheck(tokenList: TokenList, i: number): string | null  {
    if (tokenList[i].name === 'eq') return 'equals';
    if (tokenList[i].name !== 'xop') return null;
    switch (tokenList[i].value) {
        case '<': return 'lt';
        case '<=': return 'leq';
        case '>': return 'gt';
        case '>=': return 'geq';
        case '!=': return 'neq';
        default: return null;
    }
}

function sepRelOpCheck(tokenList: TokenList, i: number): string | null {
    if (tokenList[i].name !== 'xop') return null;
    switch (tokenList[i].value) {
        case '&&': return 'and';
        case '||': return 'or';
        default: return null;
    }
}

    /* pattern parsing */

function parseSimpPat(tokenList: TokenList, i: number): [number, SimpPat]
{
    if (i >= tokenList.length) parseErrorOOB("Cannot parse simple pattern.");
    switch (tokenList[i].name) {
    	case 'blank':
    		return [i + 1, { 'pat': 'blank' }];
    	/* case 'num':
            return [i + 1, { 'pat': 'const', 'ctype': 'num', 'v': tokenList[i].value }]; */
        case 'id':
            return [i + 1, { 'pat': 'id', 'x': tokenList[i].value }];
        default:
            parseError("Unexpected symbol while parsing pattern.", tokenList[i].name, tokenList[i].pos);
    }
}

var parseSPatList: ParserFun<SimpPat[]> = parseSepList(parseSimpPat, isCommaCheck);

function parsePattern(tokenList: TokenList, i: number): [number, [boolean, Pattern]]
{
	if (i >= tokenList.length) parseErrorOOB("Cannot parse pattern.");
	switch (tokenList[i].name) {
        case 'colon':
            var j = parseToken(tokenList, i + 1, 'lparen', "Missing left paren while parsing tag pattern.");
            var [j2, pl] = parseSPatList(tokenList, j);
            var j3 = parseToken(tokenList, j, 'rparen', "Missing right parent whil parsing tag pattern.");
            return [j3, [true, { 'pat': 'tuple', 'pl': pl }]];
        case 'lparen':
        	var [j, pl] = parseSPatList(tokenList, i + 1);
        	var j2 = parseToken(tokenList, j, 'rparen', "Missing right paren while parsing pattern.");
        	return [j2, [false, { 'pat': 'tuple', 'pl': pl }]];
        default:
            var [j, p] = parseSimpPat(tokenList, i);
        	return [j, [false, p]];
	}
}

	/* lvalue parsing */

type FieldExt = { kind: 'field', x: string, line: number }
type IndexExt = { kind: 'index', e: Exp, line: number }
type ElemExt = { kind: 'elem', i: number, line: number }
type LExt = FieldExt | IndexExt | ElemExt

type CallExt = { kind: 'call', el: Exp[], line: number }
type FExt = LExt | CallExt

function parseFieldExt(tokenList: TokenList, i: number): [number, LExt]
{
    if (i >= tokenList.length) parseErrorOOB("Cannot parse field.");
    switch (tokenList[i].name) {
        case 'id':
            return [i + 1, { 'kind': 'field', 'x': tokenList[i].value, 'line': tokenList[i].pos.line + 1 }];
        case 'int':
            return [i + 1, { 'kind': 'elem', 'i': parseInt(tokenList[i].value), 'line': tokenList[i].pos.line + 1 }];
        default:
            parseError("Expected either identifier or number in reference to field.", tokenList[i].name, tokenList[i].pos);
    }
}

function parseLExt(tokenList: TokenList, i: number): [number, LExt]
{
    switch (tokenList[i].name) {
        case 'dot':
            return parseFieldExt(tokenList, i + 1);
        case 'lbrace':
            var [j, e] = parseExp(tokenList, i + 1);
            var j2 = parseToken(tokenList, j, 'rbrace', "Missing identifier in lvalue index.");
            return [j2, { 'kind': 'index', 'e': e, 'line': tokenList[i].pos.line + 1 }];
        default:
            parseErrorBug("Attempted to parse lvalue extension on unexpected symbol.", tokenList[i].name, tokenList[i].pos);
    }
}

function parseFExt(tokenList: TokenList, i: number): [number, FExt]
{
    switch (tokenList[i].name) {
        case 'dot':
            return parseFieldExt(tokenList, i + 1);
        case 'lbrace':
            var [j, e] = parseExp(tokenList, i + 1);
            var j2 = parseToken(tokenList, j, 'rbrace', "Missing rbrace in index expression.");
            return [j2, { 'kind': 'index', 'e': e, 'line': tokenList[i].pos.line + 1 }];
        case 'lparen':
        	var [j, el] = parseArgList(tokenList, i + 1);
            var j2 = parseToken(tokenList, j, 'rparen', "Missing rparen in function call.");
        	return [j2, { 'kind': 'call', 'el': el, 'line': tokenList[i].pos.line + 1 }];
        default:
            parseErrorBug("Attempted to parse expression extension on unexpected symbol.", tokenList[i].name, tokenList[i].pos);
    }
}

var parseLExtList: ParserFun<LExt[]> = parseList(parseLExt, isLExtCheck);
var parseFExtList: ParserFun<FExt[]> = parseList(parseFExt, isFExtCheck);

function extToOp(ext: LExt, rw: 'r' | 'w'): [Exp, Exp[]] {
    switch (ext.kind) {
        case 'field':
            return [{ 'exp': 'op', 'o': { 'op': 'field', 'x': ext.x, 'rw': rw }, 'line': ext.line }, []];
        case 'index':
            return [{ 'exp': 'op', 'o': { 'op': 'index', 'rw': rw }, 'line': ext.line }, [ext.e]];
        case 'elem':
            if (rw === 'w') parseErrorWeak("Attempted to perform assignment to immutable tuple.", ext.line);
            return [{ 'exp': 'op', 'o': { 'op': 'elem', 'i': ext.i }, 'line': ext.line }, []];
    }
}

function fExtApp(ext: FExt, e: Exp): Exp {
    switch (ext.kind) {
        case 'call':
            return { 'exp': 'app', 'e': e, 'el': ext.el, 'line': ext.line };
        default:
            var [opx, el] = extToOp(ext, 'r');
            el.unshift(e);
            return { 'exp': 'app', 'e': opx, 'el': el, 'line': ext.line };
    }
}

function buildLVal(e0: Exp, extList: LExt[], ex: Exp): Exp
{
    var ei = e0;
    for (var i = 0; i < extList.length - 1; i++) {
        var curExt = extList[i];
        var [opx, el] = extToOp(curExt, 'r');
        el.unshift(ei);
        ei = { 'exp': 'app', 'e': opx, 'el': el, 'line': curExt.line };
    }
    var lastExt = extList[extList.length - 1];
    var [opx, el] = extToOp(lastExt, 'w');
    el.unshift(ei);
    el.push(ex);
    return { 'exp': 'app', 'e': opx, 'el': el, 'line': lastExt.line };
}

function parseLValue(tokenList: TokenList, i: number): [number, [string, LExt[]]]
{
    var j = parseToken(tokenList, i, 'id', "Missing identifier in lvalue.");
    var [j2, extList] = parseLExtList(tokenList, j);
    return [j2, [tokenList[i].value, extList]];
    //if (extList.length === 0) return { 'stmt': 'assign', 'x': tokenList[i].value, 'e':  }
    //var idVal: IdLV = { 'lval': 'id', 'x': tokenList[i].value, 'line': tokenList[i].pos.line + 1 };
    //return [j2, buildLVal(idVal, extList)];
}

	/* id list parsing */

function parseId(tokenList: TokenList, i: number): [number, string]
{
	var j = parseToken(tokenList, i, 'id', "Missing identifier in identifier list.");
	return [j, tokenList[i].value];
}


function parseIdMaybe(tokenList: TokenList, i: number): [number, string | null]
{
	if (i >= tokenList.length || tokenList[i].name !== 'id') return [i, null];
	return [i + 1, tokenList[i].value];
}

var parseIdListF: ParserFun<string[]> = parseSepList(parseId, isCommaCheck);

function parseIdList(tokenList: TokenList, i: number): [number, string[]]
{
	if (i >= tokenList.length || tokenList[i].name !== 'id') return [i, []];
	return parseIdListF(tokenList, i);
}

	/* expression parsing */

function parseLeftBinop(parseSub: ParserFun<Exp>, opChk: (TokenList, number) => string | null): ParserFun<Exp>
{
    var plb: ParserFun<[Exp, [Exp, string][]]> = parseSepListC(parseSub, opChk);
    function plf(tokenList: TokenList, i: number): [number, Exp] {
        var [j, [e0, tkList]] = plb(tokenList, i);
        if (tkList.length === 0) return [j, e0];
        var e1i: Exp = e0;
        for (var k = 0; k < tkList.length; k++) {
            var tk = tkList[k];
            var f: VarExp = { 'exp': 'var', 'x': tk[1], 'line': tokenList[i].pos.line + 1 };
            e1i = { 'exp': 'app', 'e': f, 'el': [e1i, tk[0]], 'line': tokenList[i].pos.line + 1 };
        }
        return [j, e1i];
    };
    return plf;
}

function parseKVPair(tokenList: TokenList, i: number): [number, [string, Exp]]
{
	var j = parseToken(tokenList, i, 'id', "Missing identifier for key-value pair.");
	var j2 = parseToken(tokenList, j, 'colon', "Missing colon for key-value pair.");
	var [j3, e] = parseExp(tokenList, j2);
	return [j3, [tokenList[i].value, e]];
}

var parseKVListF: ParserFun<[string, Exp][]> = parseSepList(parseKVPair, isCommaCheck);

function parseKVList(tokenList: TokenList, i: number): [number, [string, Exp][]]
{
	if (i >= tokenList.length || tokenList[i].name === 'rbrack') return [i, []];
    return parseKVListF(tokenList, i);
}

function parseAtomicExp(tokenList: TokenList, i: number): [number, Exp]
{
    if (i >= tokenList.length) parseErrorOOB("Cannot parse expression.")
    switch (tokenList[i].name) {
        case 'id':
            if (i + 1 < tokenList.length && tokenList[i + 1].name === 'is') {
                var j = parseToken(tokenList, i + 2, 'id', "Missing tag name in \'is\' expression.");
                return [j, { 'exp': 'is', 'x': tokenList[i].value, 'xt': tokenList[i + 2].value,
                    'line': tokenList[i].pos.line + 1 }];
            } else if (i + 1 < tokenList.length && tokenList[i + 1].name === 'colon') {
                var j = parseToken(tokenList, i + 2, 'lparen', "Missing lparen in tag expression.");
                var [j2, el] = parseArgList(tokenList, j);
                var j3 = parseToken(tokenList, j2, 'rparen', "Missing rparen in tag expression.");
                return [j3, { 'exp': 'tag', 'x': tokenList[i].value, 'el': el, 'line': tokenList[i].pos.line + 1 }];
            }
            return [i + 1, { 'exp': 'var', 'x': tokenList[i].value, 'line': tokenList[i].pos.line + 1 }];
        case 'int':
            return [i + 1, { 'exp': 'const', 'c': { 'const': 'int', 'i': parseInt(tokenList[i].value) }, 'line': tokenList[i].pos.line + 1 }];
        case 'float':
            return [i + 1, { 'exp': 'const', 'c': { 'const': 'float', 'f': parseFloat(tokenList[i].value) }, 'line': tokenList[i].pos.line + 1 }];
        case 'strlit':
            return [i + 1, { 'exp': 'const', 'c': { 'const': 'string', 's': tokenList[i].value }, 'line': tokenList[i].pos.line + 1 }];
        case 'true':
        case 'false':
            var b = (tokenList[i].name === 'true');
            return [i + 1, { 'exp': 'const', 'c': { 'const': 'bool', 'b': b }, 'line': tokenList[i].pos.line + 1 }];
        case 'lparen':
            var [j, el] = parseArgList(tokenList, i + 1);
            var j2 = parseToken(tokenList, j, 'rparen', "Missing rparen in parenthesized expression.");
            if (el.length === 1) return [j2, el[0]];
            else return [j2, { 'exp': 'tuple', 'el': el, 'line': tokenList[i].pos.line + 1 }];
        case 'lbrace':
        	var [j, el] = parseArgList(tokenList, i + 1);
        	var j2 = parseToken(tokenList, j, 'rbrace', "Missing rbrace in array expression.");
        	return [j2, { 'exp': 'array', 'el': el, 'line': tokenList[i].pos.line + 1 }];
        case 'lbrack':
        	var [j, fl] = parseKVList(tokenList, i + 1);
        	var j2 = parseToken(tokenList, j, 'rbrack', "Missing rbrace in struct expression.");
        	return [j2, { 'exp': 'struct', 'fl': fl, 'line': tokenList[i].pos.line + 1 }];
        case 'fn':
        	var [j, f] = parseIdMaybe(tokenList, i + 1);
        	var [j2, xl] = parseParenWrap(parseIdList, "function parameter list")(tokenList, j);
        	var [j3, body] = parseBrackWrap(parseBody, "function body")(tokenList, j2);
        	return [j3, { 'exp': 'fun', 'f': f, 'xl': xl, 'body': body, 'line': tokenList[i].pos.line + 1}];
        default:
            parseError("Unexpected symbol while parsing expression.", tokenList[i].name, tokenList[i].pos);
    }
}

function buildFieldExp(e0: Exp, extList: FExt[]): Exp
{
    var e = e0;
    for (var i = 0; i < extList.length; i++) {
        var curExt = extList[i];
        e = fExtApp(curExt, e);
    }
    return e;
}

function parseFieldExp(tokenList: TokenList, i: number): [number, Exp]
{
    var [j, e] = parseAtomicExp(tokenList, i);
    var [j2, extList] = parseFExtList(tokenList, j);
    return [j2, buildFieldExp(e, extList)];
}

var parseArithExp: ParserFun<Exp> = parseLeftBinop(parseFieldExp, sepLeftOpCheck);
var parseCompExp: ParserFun<Exp> = parseLeftBinop(parseArithExp, sepCompOpCheck);
var parseRelExp: ParserFun<Exp> = parseLeftBinop(parseCompExp, sepRelOpCheck);
var parseExp: ParserFun<Exp> = parseRelExp;

var parseArgListF: ParserFun<Exp[]> = parseSepList(parseExp, isCommaCheck);

function parseArgList(tokenList: TokenList, i: number): [number, Exp[]]
{
    if (i >= tokenList.length || tokenList[i].name === 'rparen' ||
        tokenList[i].name === 'rbrack' || tokenList[i].name === 'rbrace') return [i, []];
    return parseArgListF(tokenList, i);
}	

	/* general parse functions for statements */

function parseParenWrap<A>(f: ParserFun<A>, name: string): ParserFun<A>
{
	return function(tokenList, i) {
		var j = parseToken(tokenList, i, 'lparen', "Missing lparen for " + name + ".");
		var [j2, v] = f(tokenList, j);
		var j3 = parseToken(tokenList, j2, 'rparen', "Missing rparen for " + name + ".");
		return [j3, v];
	};
}

function parseBrackWrap<A>(f: ParserFun<A>, name: string): ParserFun<A>
{
	return function(tokenList, i) {
		var j = parseToken(tokenList, i, 'lbrack', "Missing lbrack for " + name + ".");
		var [j2, v] = f(tokenList, j);
		var j3 = parseToken(tokenList, j2, 'rbrack', "Missing rbrack for " + name + ".");
		return [j3, v];
	};
}

    /* special parse functions for branch statements */

function parseBranch(tokenList: TokenList, i: number): [number, Branch]
{
    var [j, ec] = parseParenWrap(parseExp, "if conditional")(tokenList, i);
    var [j2, body] = parseBrackWrap(parseBody, "if statement")(tokenList, j);
    return [j2, { 'e': ec, 'body': body, 'line': tokenList[i].pos.line + 1 }];
}

var parseBranchList: ParserFun<Branch[]> = parseSepList(parseBranch, isElsifCheck);

function parseElse(tokenList: TokenList, i: number): [number, Stmt[] | null]
{
    if (i >= tokenList.length) return [i, null];
    if (tokenList[i].name !== 'else') return [i, null];
    return parseBrackWrap(parseBody, "else statement")(tokenList, i + 1);
}

    /* other parse functions for statements */

function parseRange(tokenList: TokenList, i: number, p: Pattern, pToken: VToken): [number, FRange]
{
    var [j, e1] = parseExp(tokenList, i);
    if (j >= tokenList.length || tokenList[j].name !== 'to') {
    	return [j, { 'range': 'exp', 'p': p, 'e': e1 }];
    }
    var [j2, e2] = parseExp(tokenList, j + 1);
    if (p.pat !== 'id') parseError("Invalid pattern for for-loop with integer range.", pToken.name, pToken.pos);
    return [j2, { 'range': 'int', 'x': p.x, 'e1': e1, 'e2': e2, 'i': 1 }];
}

function parseQualRange(tokenList: TokenList, i: number): [number, FRange]
{
    var [j, [x, p]] = parsePattern(tokenList, i);
    if (x) parseError("Cannot use tagged patterns in for-loop range.", tokenList[i].name, tokenList[i].pos);
    var j2 = parseToken(tokenList, j, 'in', "Missing `in` symbol in for loop.");
    var [j3, r] = parseRange(tokenList, j2, p, tokenList[i]);
    return [j3, r];
}

var parseQualRangeList = parseSepList(parseQualRange, isSemiCCheck);

function buildForLoop(rl: FRange[], body: Stmt[], line: number): Stmt {
	var si = body;
	for (let i = rl.length - 1; i >= 0; i--) {
		si = [{ 'stmt': 'for', 'r': rl[i], 'body': si, 'line': line }];
	}
	return si[0];
}

function parseStmt(tokenList: TokenList, i: number): [number, Stmt]
{
    if (i >= tokenList.length) parseErrorOOB("Cannot parse start of statement.")
    var curToken = tokenList[i];
    switch(curToken.name) {
        case 'var':
            var [j, [xt, p]] = parsePattern(tokenList, i + 1);
            var j2 = parseToken(tokenList, j, 'eq', "Missing equals symbol in variable initialization.");
            var [j3, e] = parseExp(tokenList, j2);
            if (xt) {
                var opx: OpExp = { 'exp': 'op', 'o': { 'op': 'unpack' }, 'line': tokenList[i].pos.line + 1 };
                e = { 'exp': 'app', 'e': opx, 'el': [e], 'line': opx.line };
            }
            return [j3, { 'stmt': 'var', 'p': p, 'e': e, 'line': tokenList[i].pos.line + 1 }];
        case 'id':
            var [j, [x, extList]] = parseLValue(tokenList, i);
            if (j < tokenList.length && tokenList[j].name === 'eq') {
                var [j2, e] = parseExp(tokenList, j + 1);
                if (extList.length === 0) return [j2, { 'stmt': 'assign', 'x': x, 'e': e, 'line': tokenList[i].pos.line + 1 }];
                var eu = buildLVal({ 'exp': 'var', 'x': x, 'line': tokenList[i].pos.line + 1 }, extList, e);
                return [j2, { 'stmt': 'eval', 'e': eu, 'line': eu.line }];
            } else {
                var [j, e] = parseExp(tokenList, i);
                return [j, { 'stmt': 'eval', 'e': e, 'line': tokenList[i].pos.line + 1 }];
            }
        case 'if':
            var [j, brList] = parseBranchList(tokenList, i + 1);
            var [j2, elseBody] = parseElse(tokenList, j);
            return [j2, { 'stmt': 'cond', 'brList': brList, 'elseBody': elseBody, 'line': tokenList[i].pos.line + 1 }];
        case 'while':
            var [j, e] = parseParenWrap(parseExp, "while conditional")(tokenList, i + 1);
            var [j2, body] = parseBrackWrap(parseBody, "while statement")(tokenList, j);
            return [j2, { 'stmt': 'while', 'e': e, 'body': body, 'line': tokenList[i].pos.line + 1 }];
        case 'for':
            var [j, rl] = parseParenWrap(parseQualRangeList, "for-loop range list")(tokenList, i + 1);
            var [j2, body] = parseBrackWrap(parseBody, "for loop")(tokenList, j);
            return [j2, buildForLoop(rl, body, tokenList[i].pos.line + 1)];
        case 'return':
            if (i + 1 >= tokenList.length || tokenList[i + 1].name === 'rbrack') {
                return [i + 1, { 'stmt': 'return', 'e': null, 'line': tokenList[i].pos.line + 1 }];
            }
            var [j, e] = parseExp(tokenList, i + 1);
            return [j, { 'stmt': 'return', 'e': e, 'line': tokenList[i].pos.line + 1 }];
        case 'func':
        	var j = parseToken(tokenList, i + 1, 'id', "Missing name for function declaration.");
        	var [j2, xl] = parseParenWrap(parseIdList, "function parameter list")(tokenList, j);
        	var [j3, body] = parseBrackWrap(parseBody, "function body")(tokenList, j2);
            var ef: FunExp = { 'exp': 'fun', 'f': tokenList[i + 1].value, 'xl': xl, 'body': body, 'line': tokenList[i].pos.line + 1 };
        	return [j3, { 'stmt': 'var', 'p': { 'pat': 'id', 'x': tokenList[i + 1].value }, 'e': ef, 'line': ef.line }];
        default:
            var [j, e] = parseExp(tokenList, i);
            return [j, { 'stmt': 'eval', 'e': e, 'line': tokenList[i].pos.line + 1 }];
    }
}

var parseBody: ParserFun<Stmt[]> = parseList(parseStmt, isNotRBrackCheck);

export function parseBlock(tokenList: TokenList): Stmt[]
{
	var [_, block] = parseBody(tokenList, 0);
	return block;
}