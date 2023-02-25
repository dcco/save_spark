
var __globals = {};
var __settings = {};
var __window = window;
var __null = null;

	/* ###### Pipeline bootstrap ###### */

function __newShader(settings) {
	return __globals.newShader(__globals.gl, __globals.shaderLocale, __globals.pName, settings);
}

function __newFrameBuffer(settings) {
	return __globals.newFrameBuffer(__globals.gl, __globals.shaderLocale, __globals.pName, settings);
}

function __getShader(container) {
	if (container.buf === null) return { 'prog': null };
	return { 'prog': container.buf.shader };
}

function __fixedTexImage(dim, noiseList) {
	return __globals.fixedTexImageFloat(__globals.gl, dim, new Float32Array(noiseList))
}

function __frustumMat(l, r, t, b, n, f) {
	var pMat = __globals.mat4.create();
	__globals.mat4.frustum(pMat, l, r, t, b, n, f);
	return pMat;
}

function __lookAtMat(lPos, tPos, v) {
	var lMat = __globals.mat4.create();
	__globals.mat4.lookAt(lMat, lPos, tPos, v);
	return lMat;
}

	/* ###### Prelude bootstrap ###### */

function __buildMesh(mName, vs) {
	__globals.buildMesh(mName, vs);
}

	/* ###### Runtime bootstrap ###### */

	/* system functions */

function __tinyLoop(f) {
	function step$0() {
		f();
		__window.requestAnimationFrame(step$0);
	}
	step$0();
}

function __newArray(l) {
	l.add = function(v) { l.push(v); }
	l.remove = function(i) { l.splice(i, 1) }
	l.concat = function(l2) {
		for (let i = 0; i < l2.length; i++) {
			l.push(l2[i]);
		}
	}
	return l;
}

function __newStruct(l) {
	var v = {};
	for (let i = 0; i < l.length; i++) {
		var [x, m] = l[i];
		v[x] = m;
	}
	return v;
}

function __drawScene(s) {
	__globals.curScene = s;
}

function __drawScene3d(mvMat, s) {
	__globals.curMvMat = mvMat;
	__globals.curScene3d = s;
}

function __passRenderFlags(f) {
	__globals.curRenderFlags = f;
}

	/* primitive functions */

function __debugLog(v) {
	console.log(v);
}

function __iStr(i) {
	return "" + i;
}

function __div(i1, i2) {
	return Math.floor(i1 / i2);
}

function __flDiv(i1, i2) {
	return i1 / i2;
}

function __mod(i1, i2) {
	return Math.floor(i1 % i2);
}

function __abs(i) {
	return Math.abs(i);
}

function __floor(i) {
	return Math.floor(i);
}

function __round(i) {
	return Math.round(i);
}

function __sqrt(i) {
	return Math.floor(Math.sqrt(i));
}

function __approxEq(i1, i2, eps) {
	return Math.abs(i1 - i2) < eps;
}

function __toRadians(deg) {
	return deg * Math.PI / 180;
}

function __sin(i) {
	return Math.sin(__toRadians(i));
}

function __cos(i) {
	return Math.cos(__toRadians(i));
}

function __tan(i) {
	return Math.tan(__toRadians(i));
}

function __atan2(x, y) {
	return Math.round(Math.atan2(y, x) * 180 / Math.PI);
}

function __prefixText(s, i) {
	return __newArray(s.substring(0, i));
}

function __splitText(s, x) {
	return __newArray(s.split(x));
}

	/* special data structures */

function __newGrid(l) {
	function ng(ix) {
		var n = l[ix];
		var a = new Array(n);
		for (let i = 0; i < n; i++) {
			if (ix === l.length - 1) a[i] = null;
			else a[i] = ng(ix + 1);
		}
		return a;
	}
	return ng(0);
}

function __newVec3(i, j, k) {
	var v = __globals.vec3.fromValues(i, j, k);
	v.normalize = function() {
		__globals.vec3.normalize(v, v);
	};
	v.scale = function(i) {
		__globals.vec3.scale(v, v, i)
	}
	return v;
}

function __newMat() {
	var m = __globals.mat4.create();
	m.identity = function() {
		__globals.mat4.identity(m);
	};
	m.translate = function(x, y, z) {
		__globals.mat4.translate(m, m, __globals.vec3.fromValues(x, y, z));
	};
	m.rotateX = function(x) {
		__globals.mat4.rotateX(m, m, __toRadians(x));
	};
	m.rotateY = function(x) {
		__globals.mat4.rotateX(m, m, __toRadians(y));
	};
	m.rotateZ = function(x) {
		__globals.mat4.rotateX(m, m, __toRadians(z));
	};
	return m;
}

	/* special functions */

function __getTime() {
	return Math.floor(Date.now());
}

	/* random functions */

function __rndGet() {
	return Math.random();
}

function __rndRange(i, n) {
	return Math.floor(Math.random() * n) + i;
}

function __rndChance(i, n) {
	return (Math.random() * n) < i;
}

function __rndNeg(i, n) {
	if (Math.random() < 0.5) return -i;
	return i;
}

	/* draw functions */
/*
function __sceneSprite(s, frame, facing) {
	return __globals.SImage(s, frame, facing);
}

function __sceneList(sl) {
	return __globals.SList(sl);
}

function __sceneOffset(x, y, s) {
	return __globals.SOffset(x, y, s);
}

function __sceneScale(x, y, s) {
	return __globals.SScale(x, y, s);
}

function __sceneNop() {
	return __globals.SNop;
}

function __sceneBox(color, x, y, w, h) {
	return __globals.SBox(color, x, y, w, h);
}

function __render(s) {
	__globals.render(s);
}
*/
	/* drawing constants */

var __colors = {
	'BLACK': __newArray([0, 0, 0]),
	'WHITE': __newArray([255, 255, 255]),
	'F_GRAY': __newArray([128, 128, 128]),
	'F_LGRAY': __newArray([192, 192, 192]),
	'F_BLUE': __newArray([0, 0, 255]),
	'F_RED': __newArray([255, 0, 0]),
	'F_YELLOW': __newArray([255, 255, 0]),
	'F_GREEN': __newArray([0, 255, 0]),
	'F_CYAN': __newArray([0, 255, 255]),
	'F_MAGENTA': __newArray([255, 0, 255]),
	'F_ORANGE': __newArray([255, 128, 0]),
	'P_ORANGE': __newArray([255, 178, 127]),
	'P_PURPLE': __newArray([72, 0, 255]),
	'P_PINK': __newArray([255, 127, 255])
}

	/* texture/sprite loading functions */

function __getImage(name) {
	if (!__globals.GImageList.contains(name)) throw ('Could not find image `' + name + '`.');
	var image = __globals.GImageList.get(name);
	image.pixel = function (x, y) {
		if (image.src === null) throw ('Attempted to read pixel from artificial image `' + name + '`.');
		var data = image.src.imageData.data;
		var ix = (x + (y * image.width)) * 4;
		return __newArray([data[ix], data[ix + 1], data[ix + 2], data[ix + 3]]);
	};
	return image;
}

	/* input functions */

function __inputRefresh() {
	return __globals.GInput.refresh();
}

function __keyDown(s) {
	return __globals.GInput.down(s);
}

function __keyPress(s) {
	return __globals.GInput.press(s);
}

function __keyDas(s, start, f) {
	return __globals.GInput.das(s, start, f);
}

	/* quad functions */

function __vQuad(p1, p2, p3, p4) {
	return __globals.VBuf.quadVertices(p1, p2, p3, p4);
}

function __frontQuad(pos, size, z) {
	return __globals.VBuf.squareZVertices(pos, size, z);
}

function __backQuad(pos, size, z) {
	return __globals.VBuf.squareZVertices([pos[0] + size[0], pos[1]], [-size[0], size[1]], z);
}

function __topQuad(pos, size, y) {
	return __globals.VBuf.squareYVertices(pos, size, y);
}

function __botQuad(pos, size, y) {
	return __globals.VBuf.squareYVertices([pos[0] + size[0], pos[1]], [-size[0], size[1]], y);
}

function __leftQuad(pos, size, x) {
	return __globals.VBuf.squareXVertices(pos, size, x);
}

function __rightQuad(pos, size, x) {
	return __globals.VBuf.squareXVertices([pos[0] + size[0], pos[1]], [-size[0], size[1]], x);
}

	/* music/audio functions */

function __playSound(name) {
	return __globals.GAudio.playSound(name);
}

function __playMusic(name) {
	return __globals.GAudio.playMusic(name);
}

function __stopMusic() {
	return __globals.GAudio.stopMusic();
}

function __musicRefresh() {
	return __globals.GAudio.update();
}

function __getVolume() {
	return __globals.GAudio.extVol;
}

function __incVolume(n) {
	return __globals.GAudio.incVol(n);
}