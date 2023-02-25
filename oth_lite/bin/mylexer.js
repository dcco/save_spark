var MyLexer = (function (undefined) {
function CDFA_base(){
	this.ss=undefined;
	this.as=undefined;
	this.tt=undefined;
this.stt={};
}
CDFA_base.prototype.reset = function (state) {
	this.cs = state || 	this.ss;
this.bol=false;
};
CDFA_base.prototype.readSymbol = function (c) {
	this.cs = this.nextState(this.cs, c);
};
CDFA_base.prototype.isAccepting = function () {
	var acc = this.as.indexOf(this.cs)>=0;
if((this.stt[this.cs]===-1)&&!this.bol){
acc=false;}
return acc;};
CDFA_base.prototype.isInDeadState = function () {
	return this.cs === undefined || this.cs === 0;
};
CDFA_base.prototype.getCurrentToken = function(){
	var t= this.tt[this.cs];
var s=this.stt[this.cs];
if(s!==undefined){return this.bol?t:s;}
return t;};

function CDFA_DEFAULT(){
	this.ss=1;
	this.as=[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73];
	this.tt=[null,null,36,35,35,33,0,2,3,4,10,33,30,27,32,9,31,34,5,6,11,34,34,34,34,34,34,34,7,8,33,1,27,null,28,34,34,34,34,26,34,34,15,20,14,34,34,21,34,34,34,29,34,34,19,34,34,34,34,24,34,17,34,34,25,34,16,12,34,18,13,34,22,23];
this.stt={};
}
CDFA_DEFAULT.prototype= new CDFA_base();
CDFA_DEFAULT.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "!" || "#" < c)  && (c < "%" || "&" < c)  && (c < "(" || ">" < c)  && (c < "A" || "[" < c)  && (c < "]" || "_" < c)  && (c < "a" || "}" < c) ){
next = 2;
} else if(("\n" === c )){
next = 3;
} else if(("\r" === c )){
next = 3;
} else if(("!" === c ) || ("%" <= c && c <= "&")  || ("*" <= c && c <= "+")  || ("/" === c ) || ("<" === c ) || (">" === c ) || ("^" === c ) || ("|" === c )){
next = 5;
} else if(("\"" === c )){
next = 6;
} else if(("#" === c )){
next = 7;
} else if(("(" === c )){
next = 8;
} else if((")" === c )){
next = 9;
} else if(("," === c )){
next = 10;
} else if(("-" === c )){
next = 11;
} else if(("." === c )){
next = 12;
} else if(("0" <= c && c <= "9") ){
next = 13;
} else if((":" === c )){
next = 14;
} else if((";" === c )){
next = 15;
} else if(("=" === c )){
next = 16;
} else if(("A" <= c && c <= "Z")  || ("a" <= c && c <= "d")  || ("g" <= c && c <= "h")  || ("j" <= c && c <= "q")  || ("s" === c ) || ("u" === c ) || ("x" <= c && c <= "z") ){
next = 17;
} else if(("[" === c )){
next = 18;
} else if(("]" === c )){
next = 19;
} else if(("_" === c )){
next = 20;
} else if(("e" === c )){
next = 21;
} else if(("f" === c )){
next = 22;
} else if(("i" === c )){
next = 23;
} else if(("r" === c )){
next = 24;
} else if(("t" === c )){
next = 25;
} else if(("v" === c )){
next = 26;
} else if(("w" === c )){
next = 27;
} else if(("{" === c )){
next = 28;
} else if(("}" === c )){
next = 29;
}
break;
case 5:
if(("!" === c ) || ("%" <= c && c <= "&")  || ("*" <= c && c <= "+")  || ("-" === c ) || ("/" === c ) || (":" === c ) || ("<" <= c && c <= ">")  || ("^" === c ) || ("|" === c )){
next = 5;
}
break;
case 8:
if(("*" === c )){
next = 31;
}
break;
case 11:
if(("!" === c ) || ("%" <= c && c <= "&")  || ("*" <= c && c <= "+")  || ("-" === c ) || ("/" === c ) || (":" === c ) || ("<" <= c && c <= ">")  || ("^" === c ) || ("|" === c )){
next = 5;
} else if(("0" <= c && c <= "9") ){
next = 13;
}
break;
case 13:
if(("." === c )){
next = 33;
} else if(("0" <= c && c <= "9") ){
next = 13;
} else if(("f" === c )){
next = 34;
}
break;
case 14:
if(("!" === c ) || ("%" <= c && c <= "&")  || ("*" <= c && c <= "+")  || ("-" === c ) || ("/" === c ) || (":" === c ) || ("<" <= c && c <= ">")  || ("^" === c ) || ("|" === c )){
next = 5;
}
break;
case 16:
if(("!" === c ) || ("%" <= c && c <= "&")  || ("*" <= c && c <= "+")  || ("-" === c ) || ("/" === c ) || (":" === c ) || ("<" <= c && c <= ">")  || ("^" === c ) || ("|" === c )){
next = 5;
}
break;
case 17:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 20:
if(("A" <= c && c <= "Z")  || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 21:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "k")  || ("m" <= c && c <= "z") ){
next = 17;
} else if(("l" === c )){
next = 37;
}
break;
case 22:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("b" <= c && c <= "m")  || ("p" <= c && c <= "t")  || ("v" <= c && c <= "z") ){
next = 17;
} else if(("a" === c )){
next = 38;
} else if(("n" === c )){
next = 39;
} else if(("o" === c )){
next = 40;
} else if(("u" === c )){
next = 41;
}
break;
case 23:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "e")  || ("g" <= c && c <= "m")  || ("o" <= c && c <= "r")  || ("t" <= c && c <= "z") ){
next = 17;
} else if(("f" === c )){
next = 42;
} else if(("n" === c )){
next = 43;
} else if(("s" === c )){
next = 44;
}
break;
case 24:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 45;
}
break;
case 25:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "g")  || ("i" <= c && c <= "n")  || ("p" <= c && c <= "q")  || ("s" <= c && c <= "z") ){
next = 17;
} else if(("h" === c )){
next = 46;
} else if(("o" === c )){
next = 47;
} else if(("r" === c )){
next = 48;
}
break;
case 26:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("b" <= c && c <= "z") ){
next = 17;
} else if(("a" === c )){
next = 49;
}
break;
case 27:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "g")  || ("i" <= c && c <= "z") ){
next = 17;
} else if(("h" === c )){
next = 50;
}
break;
case 33:
if(("0" <= c && c <= "9") ){
next = 51;
}
break;
case 37:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "r")  || ("t" <= c && c <= "z") ){
next = 17;
} else if(("s" === c )){
next = 52;
}
break;
case 38:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "k")  || ("m" <= c && c <= "z") ){
next = 17;
} else if(("l" === c )){
next = 53;
}
break;
case 39:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 40:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "q")  || ("s" <= c && c <= "z") ){
next = 17;
} else if(("r" === c )){
next = 54;
}
break;
case 41:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "m")  || ("o" <= c && c <= "z") ){
next = 17;
} else if(("n" === c )){
next = 55;
}
break;
case 42:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 43:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 44:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 45:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "s")  || ("u" <= c && c <= "z") ){
next = 17;
} else if(("t" === c )){
next = 56;
}
break;
case 46:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 57;
}
break;
case 47:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 48:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "t")  || ("v" <= c && c <= "z") ){
next = 17;
} else if(("u" === c )){
next = 58;
}
break;
case 49:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "q")  || ("s" <= c && c <= "z") ){
next = 17;
} else if(("r" === c )){
next = 59;
}
break;
case 50:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "h")  || ("j" <= c && c <= "z") ){
next = 17;
} else if(("i" === c )){
next = 60;
}
break;
case 51:
if(("0" <= c && c <= "9") ){
next = 51;
} else if(("f" === c )){
next = 34;
}
break;
case 52:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "h")  || ("j" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 61;
} else if(("i" === c )){
next = 62;
}
break;
case 53:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "r")  || ("t" <= c && c <= "z") ){
next = 17;
} else if(("s" === c )){
next = 63;
}
break;
case 54:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 55:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "b")  || ("d" <= c && c <= "z") ){
next = 17;
} else if(("c" === c )){
next = 64;
}
break;
case 56:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "t")  || ("v" <= c && c <= "z") ){
next = 17;
} else if(("u" === c )){
next = 65;
}
break;
case 57:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "m")  || ("o" <= c && c <= "z") ){
next = 17;
} else if(("n" === c )){
next = 66;
}
break;
case 58:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 67;
}
break;
case 59:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 60:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "k")  || ("m" <= c && c <= "z") ){
next = 17;
} else if(("l" === c )){
next = 68;
}
break;
case 61:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 62:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "e")  || ("g" <= c && c <= "z") ){
next = 17;
} else if(("f" === c )){
next = 69;
}
break;
case 63:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 70;
}
break;
case 64:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 65:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "q")  || ("s" <= c && c <= "z") ){
next = 17;
} else if(("r" === c )){
next = 71;
}
break;
case 66:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 67:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 68:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "d")  || ("f" <= c && c <= "z") ){
next = 17;
} else if(("e" === c )){
next = 72;
}
break;
case 69:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 70:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 71:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "m")  || ("o" <= c && c <= "z") ){
next = 17;
} else if(("n" === c )){
next = 73;
}
break;
case 72:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
case 73:
if(("0" <= c && c <= "9")  || ("A" <= c && c <= "Z")  || ("_" === c ) || ("a" <= c && c <= "z") ){
next = 17;
}
break;
	}
	return next;
};

function CDFA_COMMENT(){
	this.ss=1;
	this.as=[2,3,4,5,6,7,8];
	this.tt=[null,null,41,40,40,41,41,38,39];
this.stt={};
}
CDFA_COMMENT.prototype= new CDFA_base();
CDFA_COMMENT.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "(" || "(" < c)  && (c < "*" || "*" < c) ){
next = 2;
} else if(("\n" === c )){
next = 3;
} else if(("\r" === c )){
next = 3;
} else if(("(" === c )){
next = 5;
} else if(("*" === c )){
next = 6;
}
break;
case 5:
if(("*" === c )){
next = 7;
}
break;
case 6:
if((")" === c )){
next = 8;
}
break;
	}
	return next;
};

function CDFA_COMMENT_LINE(){
	this.ss=1;
	this.as=[2,3,4];
	this.tt=[null,null,44,43,43];
this.stt={};
}
CDFA_COMMENT_LINE.prototype= new CDFA_base();
CDFA_COMMENT_LINE.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c) ){
next = 2;
} else if(("\n" === c )){
next = 3;
} else if(("\r" === c )){
next = 3;
}
break;
	}
	return next;
};

function CDFA_STRLIT(){
	this.ss=1;
	this.as=[2,3,4,5,6,7,8,9,10,11,12,16];
	this.tt=[null,null,54,47,47,46,54,47,48,52,49,50,51,null,null,null,53];
this.stt={};
}
CDFA_STRLIT.prototype= new CDFA_base();
CDFA_STRLIT.prototype.nextState = function(state, c){
    var next = 0;
    switch(state){
case 1:
if((c < "\n" || "\n" < c)  && (c < "\r" || "\r" < c)  && (c < "\"" || "\"" < c)  && (c < "\\" || "\\" < c) ){
next = 2;
} else if(("\n" === c )){
next = 3;
} else if(("\r" === c )){
next = 3;
} else if(("\"" === c )){
next = 5;
} else if(("\\" === c )){
next = 6;
}
break;
case 3:
if(("\t" <= c && c <= "\n")  || ("\r" === c ) || (" " === c ) || (" " === c )){
next = 3;
}
break;
case 6:
if(("\"" === c )){
next = 8;
} else if(("\\" === c )){
next = 9;
} else if(("n" === c )){
next = 10;
} else if(("r" === c )){
next = 11;
} else if(("t" === c )){
next = 12;
} else if(("u" === c )){
next = 13;
}
break;
case 13:
if(("0" <= c && c <= "9") ){
next = 14;
}
break;
case 14:
if(("0" <= c && c <= "9") ){
next = 15;
}
break;
case 15:
if(("0" <= c && c <= "9") ){
next = 16;
}
break;
	}
	return next;
};

var EOF={};
function Lexer(){

if(!(this instanceof Lexer)) return new Lexer();

this.pos={line:0,col:0};

this.states={};
this.state = ['DEFAULT'];
this.lastChar = '\n';
this.actions = [function anonymous(
) {

    this.sBuild = '';
    this.pushState('STRLIT');

},function anonymous(
) {

    if (this.pDepth === undefined) {
        this.pDepth = 0;
    }
    this.pDepth = this.pDepth + 1;
    this.pushState('COMMENT');

},function anonymous(
) {

    this.pushState('COMMENT_LINE');

},function anonymous(
) {
 return 'lparen'; 
},function anonymous(
) {
 return 'rparen'; 
},function anonymous(
) {
 return 'lbrace'; 
},function anonymous(
) {
 return 'rbrace'; 
},function anonymous(
) {
 return 'lbrack'; 
},function anonymous(
) {
 return 'rbrack'; 
},function anonymous(
) {
 return 'semic'; 
},function anonymous(
) {
 return 'comma'; 
},function anonymous(
) {
 return 'blank'; 
},function anonymous(
) {
 return 'true'; 
},function anonymous(
) {
 return 'false'; 
},function anonymous(
) {
 return 'is'; 
},function anonymous(
) {
 return 'if'; 
},function anonymous(
) {
 return 'then'; 
},function anonymous(
) {
 return 'else'; 
},function anonymous(
) {
 return 'elsif'; 
},function anonymous(
) {
 return 'for'; 
},function anonymous(
) {
 return 'in'; 
},function anonymous(
) {
 return 'to'; 
},function anonymous(
) {
 return 'while'; 
},function anonymous(
) {
 return 'return'; 
},function anonymous(
) {
 return 'var'; 
},function anonymous(
) {
 return 'func'; 
},function anonymous(
) {
 return 'fn'; 
},function anonymous(
) {

    this.jjval = this.jjtext;
    return 'int';    

},function anonymous(
) {

    this.jjval = this.jjtext;
    return 'float';    

},function anonymous(
) {

    this.jjval = this.jjtext;
    return 'float';    

},function anonymous(
) {
 return 'dot'; 
},function anonymous(
) {
 return 'eq'; 
},function anonymous(
) {
 return 'colon'; 
},function anonymous(
) {

    this.jjval = this.jjtext;
    return 'xop';

},function anonymous(
) {

    this.jjval = this.jjtext;
    return 'id'; 

},,,function anonymous(
) {
 return 'EOF'; 
},function anonymous(
) {

    this.pDepth = this.pDepth + 1;

},function anonymous(
) {

    this.pDepth = this.pDepth - 1;
    if (this.pDepth === 0) this.popState();

},,,function anonymous(
) {
 return 'EOF'; 
},function anonymous(
) {
 this.popState(); 
},,function anonymous(
) {
 return 'EOF'; 
},function anonymous(
) {

    this.jjval = this.sBuild;
    this.popState();
    return 'strlit';

},,function anonymous(
) {

    this.sBuild = this.sBuild + '\"';

},function anonymous(
) {

    this.sBuild = this.sBuild + '\n';

},function anonymous(
) {

    this.sBuild = this.sBuild + '\r';

},function anonymous(
) {

    this.sBuild = this.sBuild + '\t';

},function anonymous(
) {

    this.sBuild = this.sBuild + '\\';

},function anonymous(
) {

    this.sBuild = this.sBuild + String.fromCharCode(2, 5);

},function anonymous(
) {

    this.sBuild = this.sBuild + this.jjtext;

},function anonymous(
) {
 return 'EOF'; 
}];
this.states["DEFAULT"] = {};
this.states["DEFAULT"].dfa = new CDFA_DEFAULT();
this.states["COMMENT"] = {};
this.states["COMMENT"].dfa = new CDFA_COMMENT();
this.states["COMMENT_LINE"] = {};
this.states["COMMENT_LINE"].dfa = new CDFA_COMMENT_LINE();
this.states["STRLIT"] = {};
this.states["STRLIT"].dfa = new CDFA_STRLIT();
}
Lexer.prototype.setInput=function(input){
        this.pos={row:0, col:0};
        if(typeof input === 'string')
        {input = new StringReader(input);}
        this.input = input;
        this.state = ['DEFAULT'];
        this.lastChar='\n';
        this.getDFA().reset();
        return this;
    };
Lexer.prototype.nextToken=function () {


        var ret = undefined;
        while(ret === undefined){
            this.resetToken();
            ret = this.more();
        }


        if (ret === EOF) {
            this.current = EOF;
        } else {
            this.current = {};
            this.current.name = ret;
            this.current.value = this.jjval;
            this.current.lexeme = this.jjtext;
            this.current.position = this.jjpos;
            this.current.pos = {col: this.jjcol, line: this.jjline};
        }
        return this.current;
    };
Lexer.prototype.resetToken=function(){
        this.getDFA().reset();
        this.getDFA().bol = (this.lastChar === '\n');
        this.lastValid = undefined;
        this.lastValidPos = -1;
        this.jjtext = '';
        this.remains = '';
        this.buffer = '';
        this.startpos = this.input.getPos();
        this.jjline = this.input.line;
        this.jjcol = this.input.col;
    };
Lexer.prototype.halt=function () {
        if (this.lastValidPos >= 0) {
            var lastValidLength = this.lastValidPos-this.startpos+1;
            this.jjtext = this.buffer.substring(0, lastValidLength);
            this.remains = this.buffer.substring(lastValidLength);
            this.jjval = this.jjtext;
            this.jjpos = this.lastValidPos + 1-this.jjtext.length;
            this.input.rollback(this.remains);
            var action = this.getAction(this.lastValid);
            if (typeof ( action) === 'function') {
                return action.call(this);
            }
            this.resetToken();
        }
        else if(!this.input.more()){//EOF
            var actionid = this.states[this.getState()].eofaction;
            if(actionid){
                action = this.getAction(actionid);
                if (typeof ( action) === 'function') {
                    //Note we don't care of returned token, must return 'EOF'
                    action.call(this);
                }
            }
            return EOF;
        } else {//Unexpected character
            throw new Error('Unexpected char \''+this.input.peek()+'\' at '+this.jjline +':'+this.jjcol);
        }
    };
Lexer.prototype.more=function(){
        var ret;
        while (this.input.more()) {
            var c = this.input.peek();
            this.getDFA().readSymbol(c);
            if (this.getDFA().isInDeadState()) {

                ret = this.halt();
                return ret;

            } else {
                if (this.getDFA().isAccepting()) {
                    this.lastValid = this.getDFA().getCurrentToken();
                    this.lastValidPos = this.input.getPos();

                }
                this.buffer = this.buffer + c;
                this.lastChar = c;
                this.input.next();
            }

        }
        ret = this.halt();
        return ret;
    };
Lexer.prototype.less=function(length){
        this.input.rollback(length);
    };
Lexer.prototype.getDFA=function(){
        return this.states[this.getState()].dfa;
    };
Lexer.prototype.getAction=function(i){
        return this.actions[i];
    };
Lexer.prototype.pushState=function(state){
        this.state.push(state);
        this.getDFA().reset();
    };
Lexer.prototype.popState=function(){
        if(this.state.length>1) {
            this.state.pop();
            this.getDFA().reset();
        }
    };
Lexer.prototype.getState=function(){
        return this.state[this.state.length-1];
    };
Lexer.prototype.restoreLookAhead=function(){
        this.tailLength = this.jjtext.length;
        this.popState();
        this.less(this.tailLength);
        this.jjtext = this.lawhole.substring(0,this.lawhole.length-this.tailLength);


    };
Lexer.prototype.evictTail=function(length){
        this.less(length);
        this.jjtext = this.jjtext.substring(0,this.jjtext.length-length);
    };
Lexer.prototype.isEOF=function(o){
        return o===EOF;
    }
;
function StringReader(str){
        if(!(this instanceof StringReader)) return new StringReader(str);
		this.str = str;
		this.pos = 0;
        this.line = 0;
        this.col = 0;
	}
StringReader.prototype.getPos=function(){
        return this.pos;
    };
StringReader.prototype.peek=function()
	{
		//TODO: handle EOF
		return this.str.charAt(this.pos);
	};
StringReader.prototype.eat=function(str)
	{
		var istr = this.str.substring(this.pos,this.pos+str.length);
		if(istr===str){
			this.pos+=str.length;
            this.updatePos(str,1);
		} else {
			throw new Error('Expected "'+str+'", got "'+istr+'"!');
		}
	};
StringReader.prototype.updatePos=function(str,delta){
        for(var i=0;i<str.length;i++){
            if(str[i]=='\n'){
                this.col=0;
                this.line+=delta;
            }else{
                this.col+=delta;
            }
        }
    };
StringReader.prototype.rollback=function(str)
    {
        if(typeof str === 'string')
        {
            var istr = this.str.substring(this.pos-str.length,this.pos);
            if(istr===str){
                this.pos-=str.length;
                this.updatePos(str,-1);
            } else {
                throw new Error('Expected "'+str+'", got "'+istr+'"!');
            }
        } else {
            this.pos-=str;
            this.updatePos(str,-1);
        }

    };
StringReader.prototype.next=function()
	{
		var s = this.str.charAt(this.pos);
		this.pos=this.pos+1;
		this.updatePos(s,1);
		return s;
	};
StringReader.prototype.more=function()
	{
		return this.pos<this.str.length;
	};
StringReader.prototype.reset=function(){
        this.pos=0;
    };
if (typeof(module) !== 'undefined') { module.exports = Lexer; }
return Lexer;})();