define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.parseBlock = void 0;
    /* system parse functions */
    function parseError(desc, name, pos) {
        throw ('Parse error [' + desc + '] at line ' + (pos.line + 1) + ', column ' + (pos.col + 1) + ', on token: ' + name);
    }
    function parseErrorWeak(desc, line) {
        throw ('Parse error [' + desc + '] at line ' + line);
    }
    function parseErrorBug(desc, name, pos) {
        throw ('BUG: parser.ts - Parse error [' + desc + '] at line ' + (pos.line + 1) + ', column ' + (pos.col + 1) + ', on token: ' + name);
    }
    function parseErrorOOB(desc) {
        throw ('Parse error [' + desc + '] caused by end of file.');
    }
    /* common parse functions / list combinators */
    function parseToken(tokenList, i, name, err) {
        if (i >= tokenList.length)
            parseErrorOOB(err);
        else if (tokenList[i].name === name)
            return i + 1;
        else
            parseError(err, tokenList[i].name, tokenList[i].pos);
    }
    function parseList(f, chk) {
        function plf(tokenList, i) {
            var ii = i;
            var tkList = [];
            while (ii < tokenList.length && chk(tokenList, ii)) {
                var _a = f(tokenList, ii), j = _a[0], tk = _a[1];
                tkList.push(tk);
                ii = j;
            }
            return [ii, tkList];
        }
        ;
        return plf;
    }
    function parseSepList(f, sChk) {
        function plf(tokenList, i) {
            // parse the first exp
            var _a = f(tokenList, i), j = _a[0], tk0 = _a[1];
            var ii = j;
            var tkList = [tk0];
            // while the separator is valid
            while (ii < tokenList.length && sChk(tokenList, ii)) {
                // parse the next exp
                var _b = f(tokenList, ii + 1), j = _b[0], tk = _b[1];
                tkList.push(tk);
                ii = j;
            }
            return [ii, tkList];
        }
        ;
        return plf;
    }
    function parseSepTail(f, sChk) {
        function plf(tokenList, i) {
            // parse the first exp
            var ii = i;
            var tkList = [];
            // while the separator is valid
            while (ii < tokenList.length && sChk(tokenList, ii)) {
                // parse the next exp
                var _a = f(tokenList, ii + 1), j = _a[0], tk = _a[1];
                tkList.push(tk);
                ii = j;
            }
            return [ii, tkList];
        }
        ;
        return plf;
    }
    function parseSepListC(f, sChk) {
        function plf(tokenList, i) {
            // parse the first exp
            var _a = f(tokenList, i), j = _a[0], tk0 = _a[1];
            var ii = j;
            var tkList = [];
            // parse the first separator
            var curSep = null;
            if (ii < tokenList.length)
                curSep = sChk(tokenList, ii);
            // while the separator is valid
            while (curSep !== null) {
                // parse the next exp
                var _b = f(tokenList, ii + 1), j = _b[0], tk = _b[1];
                tkList.push([tk, curSep]);
                ii = j;
                // parse the next separator
                curSep = null;
                if (ii < tokenList.length)
                    curSep = sChk(tokenList, ii);
            }
            return [ii, [tk0, tkList]];
        }
        ;
        return plf;
    }
    /* checks used for lists */
    function isCommaCheck(tokenList, i) {
        return tokenList[i].name === 'comma';
    }
    function isLExtCheck(tokenList, i) {
        return tokenList[i].name === 'dot' || tokenList[i].name === 'lbrace';
    }
    function isFExtCheck(tokenList, i) {
        return tokenList[i].name === 'dot' || tokenList[i].name === 'lbrace' || tokenList[i].name === 'lparen';
    }
    function isElsifCheck(tokenList, i) {
        return tokenList[i].name === 'elsif';
    }
    function isCaseCheck(tokenList, i) {
        return tokenList[i].name === 'case';
    }
    function isSemiCCheck(tokenList, i) {
        return tokenList[i].name === 'semic';
    }
    function isNotRBrackCheck(tokenList, i) {
        return tokenList[i].name !== 'rbrack';
    }
    function sepLeftOpCheck(tokenList, i) {
        if (tokenList[i].name !== 'xop')
            return null;
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
    function sepCompOpCheck(tokenList, i) {
        if (tokenList[i].name === 'eq')
            return 'equals';
        if (tokenList[i].name !== 'xop')
            return null;
        switch (tokenList[i].value) {
            case '<': return 'lt';
            case '<=': return 'leq';
            case '>': return 'gt';
            case '>=': return 'geq';
            case '!=': return 'neq';
            default: return null;
        }
    }
    function sepRelOpCheck(tokenList, i) {
        if (tokenList[i].name !== 'xop')
            return null;
        switch (tokenList[i].value) {
            case '&&': return 'and';
            case '||': return 'or';
            default: return null;
        }
    }
    /* pattern parsing */
    function parseSimpPat(tokenList, i) {
        if (i >= tokenList.length)
            parseErrorOOB("Cannot parse simple pattern.");
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
    var parseSPatList = parseSepList(parseSimpPat, isCommaCheck);
    function parsePattern(tokenList, i) {
        if (i >= tokenList.length)
            parseErrorOOB("Cannot parse pattern.");
        switch (tokenList[i].name) {
            case 'colon':
                var j = parseToken(tokenList, i + 1, 'lparen', "Missing left paren while parsing tag pattern.");
                var _a = parseSPatList(tokenList, j), j2 = _a[0], pl = _a[1];
                var j3 = parseToken(tokenList, j, 'rparen', "Missing right parent whil parsing tag pattern.");
                return [j3, [true, { 'pat': 'tuple', 'pl': pl }]];
            case 'lparen':
                var _b = parseSPatList(tokenList, i + 1), j = _b[0], pl = _b[1];
                var j2 = parseToken(tokenList, j, 'rparen', "Missing right paren while parsing pattern.");
                return [j2, [false, { 'pat': 'tuple', 'pl': pl }]];
            default:
                var _c = parseSimpPat(tokenList, i), j = _c[0], p = _c[1];
                return [j, [false, p]];
        }
    }
    function parseFieldExt(tokenList, i) {
        if (i >= tokenList.length)
            parseErrorOOB("Cannot parse field.");
        switch (tokenList[i].name) {
            case 'id':
                return [i + 1, { 'kind': 'field', 'x': tokenList[i].value, 'line': tokenList[i].pos.line + 1 }];
            case 'int':
                return [i + 1, { 'kind': 'elem', 'i': parseInt(tokenList[i].value), 'line': tokenList[i].pos.line + 1 }];
            default:
                parseError("Expected either identifier or number in reference to field.", tokenList[i].name, tokenList[i].pos);
        }
    }
    function parseLExt(tokenList, i) {
        switch (tokenList[i].name) {
            case 'dot':
                return parseFieldExt(tokenList, i + 1);
            case 'lbrace':
                var _a = parseExp(tokenList, i + 1), j = _a[0], e = _a[1];
                var j2 = parseToken(tokenList, j, 'rbrace', "Missing identifier in lvalue index.");
                return [j2, { 'kind': 'index', 'e': e, 'line': tokenList[i].pos.line + 1 }];
            default:
                parseErrorBug("Attempted to parse lvalue extension on unexpected symbol.", tokenList[i].name, tokenList[i].pos);
        }
    }
    function parseFExt(tokenList, i) {
        switch (tokenList[i].name) {
            case 'dot':
                return parseFieldExt(tokenList, i + 1);
            case 'lbrace':
                var _a = parseExp(tokenList, i + 1), j = _a[0], e = _a[1];
                var j2 = parseToken(tokenList, j, 'rbrace', "Missing rbrace in index expression.");
                return [j2, { 'kind': 'index', 'e': e, 'line': tokenList[i].pos.line + 1 }];
            case 'lparen':
                var _b = parseArgList(tokenList, i + 1), j = _b[0], el = _b[1];
                var j2 = parseToken(tokenList, j, 'rparen', "Missing rparen in function call.");
                return [j2, { 'kind': 'call', 'el': el, 'line': tokenList[i].pos.line + 1 }];
            default:
                parseErrorBug("Attempted to parse expression extension on unexpected symbol.", tokenList[i].name, tokenList[i].pos);
        }
    }
    var parseLExtList = parseList(parseLExt, isLExtCheck);
    var parseFExtList = parseList(parseFExt, isFExtCheck);
    function extToOp(ext, rw) {
        switch (ext.kind) {
            case 'field':
                return [{ 'exp': 'op', 'o': { 'op': 'field', 'x': ext.x, 'rw': rw }, 'line': ext.line }, []];
            case 'index':
                return [{ 'exp': 'op', 'o': { 'op': 'index', 'rw': rw }, 'line': ext.line }, [ext.e]];
            case 'elem':
                if (rw === 'w')
                    parseErrorWeak("Attempted to perform assignment to immutable tuple.", ext.line);
                return [{ 'exp': 'op', 'o': { 'op': 'elem', 'i': ext.i }, 'line': ext.line }, []];
        }
    }
    function fExtApp(ext, e) {
        switch (ext.kind) {
            case 'call':
                return { 'exp': 'app', 'e': e, 'el': ext.el, 'line': ext.line };
            default:
                var _a = extToOp(ext, 'r'), opx = _a[0], el = _a[1];
                el.unshift(e);
                return { 'exp': 'app', 'e': opx, 'el': el, 'line': ext.line };
        }
    }
    function buildLVal(e0, extList, ex) {
        var ei = e0;
        for (var i = 0; i < extList.length - 1; i++) {
            var curExt = extList[i];
            var _a = extToOp(curExt, 'r'), opx = _a[0], el = _a[1];
            el.unshift(ei);
            ei = { 'exp': 'app', 'e': opx, 'el': el, 'line': curExt.line };
        }
        var lastExt = extList[extList.length - 1];
        var _b = extToOp(lastExt, 'w'), opx = _b[0], el = _b[1];
        el.unshift(ei);
        el.push(ex);
        return { 'exp': 'app', 'e': opx, 'el': el, 'line': lastExt.line };
    }
    function parseLValue(tokenList, i) {
        var j = parseToken(tokenList, i, 'id', "Missing identifier in lvalue.");
        var _a = parseLExtList(tokenList, j), j2 = _a[0], extList = _a[1];
        return [j2, [tokenList[i].value, extList]];
        //if (extList.length === 0) return { 'stmt': 'assign', 'x': tokenList[i].value, 'e':  }
        //var idVal: IdLV = { 'lval': 'id', 'x': tokenList[i].value, 'line': tokenList[i].pos.line + 1 };
        //return [j2, buildLVal(idVal, extList)];
    }
    /* id list parsing */
    function parseId(tokenList, i) {
        var j = parseToken(tokenList, i, 'id', "Missing identifier in identifier list.");
        return [j, tokenList[i].value];
    }
    function parseIdMaybe(tokenList, i) {
        if (i >= tokenList.length || tokenList[i].name !== 'id')
            return [i, null];
        return [i + 1, tokenList[i].value];
    }
    var parseIdListF = parseSepList(parseId, isCommaCheck);
    function parseIdList(tokenList, i) {
        if (i >= tokenList.length || tokenList[i].name !== 'id')
            return [i, []];
        return parseIdListF(tokenList, i);
    }
    /* expression parsing */
    function parseLeftBinop(parseSub, opChk) {
        var plb = parseSepListC(parseSub, opChk);
        function plf(tokenList, i) {
            var _a = plb(tokenList, i), j = _a[0], _b = _a[1], e0 = _b[0], tkList = _b[1];
            if (tkList.length === 0)
                return [j, e0];
            var e1i = e0;
            for (var k = 0; k < tkList.length; k++) {
                var tk = tkList[k];
                var f = { 'exp': 'var', 'x': tk[1], 'line': tokenList[i].pos.line + 1 };
                e1i = { 'exp': 'app', 'e': f, 'el': [e1i, tk[0]], 'line': tokenList[i].pos.line + 1 };
            }
            return [j, e1i];
        }
        ;
        return plf;
    }
    function parseKVPair(tokenList, i) {
        var j = parseToken(tokenList, i, 'id', "Missing identifier for key-value pair.");
        var j2 = parseToken(tokenList, j, 'colon', "Missing colon for key-value pair.");
        var _a = parseExp(tokenList, j2), j3 = _a[0], e = _a[1];
        return [j3, [tokenList[i].value, e]];
    }
    var parseKVListF = parseSepList(parseKVPair, isCommaCheck);
    function parseKVList(tokenList, i) {
        if (i >= tokenList.length || tokenList[i].name === 'rbrack')
            return [i, []];
        return parseKVListF(tokenList, i);
    }
    function parseAtomicExp(tokenList, i) {
        if (i >= tokenList.length)
            parseErrorOOB("Cannot parse expression.");
        switch (tokenList[i].name) {
            case 'id':
                if (i + 1 < tokenList.length && tokenList[i + 1].name === 'is') {
                    var j = parseToken(tokenList, i + 2, 'id', "Missing tag name in \'is\' expression.");
                    return [j, { 'exp': 'is', 'x': tokenList[i].value, 'xt': tokenList[i + 2].value,
                            'line': tokenList[i].pos.line + 1 }];
                }
                else if (i + 1 < tokenList.length && tokenList[i + 1].name === 'colon') {
                    var j = parseToken(tokenList, i + 2, 'lparen', "Missing lparen in tag expression.");
                    var _a = parseArgList(tokenList, j), j2 = _a[0], el = _a[1];
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
                var _b = parseArgList(tokenList, i + 1), j = _b[0], el = _b[1];
                var j2 = parseToken(tokenList, j, 'rparen', "Missing rparen in parenthesized expression.");
                if (el.length === 1)
                    return [j2, el[0]];
                else
                    return [j2, { 'exp': 'tuple', 'el': el, 'line': tokenList[i].pos.line + 1 }];
            case 'lbrace':
                var _c = parseArgList(tokenList, i + 1), j = _c[0], el = _c[1];
                var j2 = parseToken(tokenList, j, 'rbrace', "Missing rbrace in array expression.");
                return [j2, { 'exp': 'array', 'el': el, 'line': tokenList[i].pos.line + 1 }];
            case 'lbrack':
                var _d = parseKVList(tokenList, i + 1), j = _d[0], fl = _d[1];
                var j2 = parseToken(tokenList, j, 'rbrack', "Missing rbrace in struct expression.");
                return [j2, { 'exp': 'struct', 'fl': fl, 'line': tokenList[i].pos.line + 1 }];
            case 'fn':
                var _e = parseIdMaybe(tokenList, i + 1), j = _e[0], f = _e[1];
                var _f = parseParenWrap(parseIdList, "function parameter list")(tokenList, j), j2 = _f[0], xl = _f[1];
                var _g = parseBrackWrap(parseBody, "function body")(tokenList, j2), j3 = _g[0], body = _g[1];
                return [j3, { 'exp': 'fun', 'f': f, 'xl': xl, 'body': body, 'line': tokenList[i].pos.line + 1 }];
            default:
                parseError("Unexpected symbol while parsing expression.", tokenList[i].name, tokenList[i].pos);
        }
    }
    function buildFieldExp(e0, extList) {
        var e = e0;
        for (var i = 0; i < extList.length; i++) {
            var curExt = extList[i];
            e = fExtApp(curExt, e);
        }
        return e;
    }
    function parseFieldExp(tokenList, i) {
        var _a = parseAtomicExp(tokenList, i), j = _a[0], e = _a[1];
        var _b = parseFExtList(tokenList, j), j2 = _b[0], extList = _b[1];
        return [j2, buildFieldExp(e, extList)];
    }
    var parseArithExp = parseLeftBinop(parseFieldExp, sepLeftOpCheck);
    var parseCompExp = parseLeftBinop(parseArithExp, sepCompOpCheck);
    var parseRelExp = parseLeftBinop(parseCompExp, sepRelOpCheck);
    var parseExp = parseRelExp;
    var parseArgListF = parseSepList(parseExp, isCommaCheck);
    function parseArgList(tokenList, i) {
        if (i >= tokenList.length || tokenList[i].name === 'rparen' ||
            tokenList[i].name === 'rbrack' || tokenList[i].name === 'rbrace')
            return [i, []];
        return parseArgListF(tokenList, i);
    }
    /* general parse functions for statements */
    function parseParenWrap(f, name) {
        return function (tokenList, i) {
            var j = parseToken(tokenList, i, 'lparen', "Missing lparen for " + name + ".");
            var _a = f(tokenList, j), j2 = _a[0], v = _a[1];
            var j3 = parseToken(tokenList, j2, 'rparen', "Missing rparen for " + name + ".");
            return [j3, v];
        };
    }
    function parseBrackWrap(f, name) {
        return function (tokenList, i) {
            var j = parseToken(tokenList, i, 'lbrack', "Missing lbrack for " + name + ".");
            var _a = f(tokenList, j), j2 = _a[0], v = _a[1];
            var j3 = parseToken(tokenList, j2, 'rbrack', "Missing rbrack for " + name + ".");
            return [j3, v];
        };
    }
    /* special parse functions for branch statements */
    function parseBranch(tokenList, i) {
        var _a = parseParenWrap(parseExp, "if conditional")(tokenList, i), j = _a[0], ec = _a[1];
        var _b = parseBrackWrap(parseBody, "if statement")(tokenList, j), j2 = _b[0], body = _b[1];
        return [j2, { 'e': ec, 'body': body, 'line': tokenList[i].pos.line + 1 }];
    }
    var parseBranchList = parseSepList(parseBranch, isElsifCheck);
    function parseElse(tokenList, i) {
        if (i >= tokenList.length)
            return [i, null];
        if (tokenList[i].name !== 'else')
            return [i, null];
        return parseBrackWrap(parseBody, "else statement")(tokenList, i + 1);
    }
    /* other parse functions for statements */
    function parseRange(tokenList, i, p, pToken) {
        var _a = parseExp(tokenList, i), j = _a[0], e1 = _a[1];
        if (j >= tokenList.length || tokenList[j].name !== 'to') {
            return [j, { 'range': 'exp', 'p': p, 'e': e1 }];
        }
        var _b = parseExp(tokenList, j + 1), j2 = _b[0], e2 = _b[1];
        if (p.pat !== 'id')
            parseError("Invalid pattern for for-loop with integer range.", pToken.name, pToken.pos);
        return [j2, { 'range': 'int', 'x': p.x, 'e1': e1, 'e2': e2, 'i': 1 }];
    }
    function parseQualRange(tokenList, i) {
        var _a = parsePattern(tokenList, i), j = _a[0], _b = _a[1], x = _b[0], p = _b[1];
        if (x)
            parseError("Cannot use tagged patterns in for-loop range.", tokenList[i].name, tokenList[i].pos);
        var j2 = parseToken(tokenList, j, 'in', "Missing `in` symbol in for loop.");
        var _c = parseRange(tokenList, j2, p, tokenList[i]), j3 = _c[0], r = _c[1];
        return [j3, r];
    }
    var parseQualRangeList = parseSepList(parseQualRange, isSemiCCheck);
    function buildForLoop(rl, body, line) {
        var si = body;
        for (var i = rl.length - 1; i >= 0; i--) {
            si = [{ 'stmt': 'for', 'r': rl[i], 'body': si, 'line': line }];
        }
        return si[0];
    }
    function parseStmt(tokenList, i) {
        if (i >= tokenList.length)
            parseErrorOOB("Cannot parse start of statement.");
        var curToken = tokenList[i];
        switch (curToken.name) {
            case 'var':
                var _a = parsePattern(tokenList, i + 1), j = _a[0], _b = _a[1], xt = _b[0], p = _b[1];
                var j2 = parseToken(tokenList, j, 'eq', "Missing equals symbol in variable initialization.");
                var _c = parseExp(tokenList, j2), j3 = _c[0], e = _c[1];
                if (xt) {
                    var opx = { 'exp': 'op', 'o': { 'op': 'unpack' }, 'line': tokenList[i].pos.line + 1 };
                    e = { 'exp': 'app', 'e': opx, 'el': [e], 'line': opx.line };
                }
                return [j3, { 'stmt': 'var', 'p': p, 'e': e, 'line': tokenList[i].pos.line + 1 }];
            case 'id':
                var _d = parseLValue(tokenList, i), j = _d[0], _e = _d[1], x = _e[0], extList = _e[1];
                if (j < tokenList.length && tokenList[j].name === 'eq') {
                    var _f = parseExp(tokenList, j + 1), j2 = _f[0], e = _f[1];
                    if (extList.length === 0)
                        return [j2, { 'stmt': 'assign', 'x': x, 'e': e, 'line': tokenList[i].pos.line + 1 }];
                    var eu = buildLVal({ 'exp': 'var', 'x': x, 'line': tokenList[i].pos.line + 1 }, extList, e);
                    return [j2, { 'stmt': 'eval', 'e': eu, 'line': eu.line }];
                }
                else {
                    var _g = parseExp(tokenList, i), j = _g[0], e = _g[1];
                    return [j, { 'stmt': 'eval', 'e': e, 'line': tokenList[i].pos.line + 1 }];
                }
            case 'if':
                var _h = parseBranchList(tokenList, i + 1), j = _h[0], brList = _h[1];
                var _j = parseElse(tokenList, j), j2 = _j[0], elseBody = _j[1];
                return [j2, { 'stmt': 'cond', 'brList': brList, 'elseBody': elseBody, 'line': tokenList[i].pos.line + 1 }];
            case 'while':
                var _k = parseParenWrap(parseExp, "while conditional")(tokenList, i + 1), j = _k[0], e = _k[1];
                var _l = parseBrackWrap(parseBody, "while statement")(tokenList, j), j2 = _l[0], body = _l[1];
                return [j2, { 'stmt': 'while', 'e': e, 'body': body, 'line': tokenList[i].pos.line + 1 }];
            case 'for':
                var _m = parseParenWrap(parseQualRangeList, "for-loop range list")(tokenList, i + 1), j = _m[0], rl = _m[1];
                var _o = parseBrackWrap(parseBody, "for loop")(tokenList, j), j2 = _o[0], body = _o[1];
                return [j2, buildForLoop(rl, body, tokenList[i].pos.line + 1)];
            case 'return':
                if (i + 1 >= tokenList.length || tokenList[i + 1].name === 'rbrack') {
                    return [i + 1, { 'stmt': 'return', 'e': null, 'line': tokenList[i].pos.line + 1 }];
                }
                var _p = parseExp(tokenList, i + 1), j = _p[0], e = _p[1];
                return [j, { 'stmt': 'return', 'e': e, 'line': tokenList[i].pos.line + 1 }];
            case 'func':
                var j = parseToken(tokenList, i + 1, 'id', "Missing name for function declaration.");
                var _q = parseParenWrap(parseIdList, "function parameter list")(tokenList, j), j2 = _q[0], xl = _q[1];
                var _r = parseBrackWrap(parseBody, "function body")(tokenList, j2), j3 = _r[0], body = _r[1];
                var ef = { 'exp': 'fun', 'f': tokenList[i + 1].value, 'xl': xl, 'body': body, 'line': tokenList[i].pos.line + 1 };
                return [j3, { 'stmt': 'var', 'p': { 'pat': 'id', 'x': tokenList[i + 1].value }, 'e': ef, 'line': ef.line }];
            default:
                var _s = parseExp(tokenList, i), j = _s[0], e = _s[1];
                return [j, { 'stmt': 'eval', 'e': e, 'line': tokenList[i].pos.line + 1 }];
        }
    }
    var parseBody = parseList(parseStmt, isNotRBrackCheck);
    function parseBlock(tokenList) {
        var _a = parseBody(tokenList, 0), _ = _a[0], block = _a[1];
        return block;
    }
    exports.parseBlock = parseBlock;
});
