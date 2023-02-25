
import { mat4 } from "gl-matrix"
import { XScreen } from "z/main/screen"
import { TBuffer, makeTexBuffer, updateTexBuffer, squareTexCoords } from "z/shader/buffer"
import { GL, ShaderProg, Shader, setUniformMat, addAttrib, addUniform, addUniformTex,
		useShader, clearShader } from "z/shader/shader"
import { FrameBuffer, texNum, useFrameBuffer, clearFrameBuffer, useBufferTexture, switchDrawBuffers } from "z/shader/frame-buffer"
import { drawMeshWithBuf } from "z/mat/mesh"
import { DrawCont, Scene3d, procUniformArgs, render3d } from "z/sys/canvas/scene3d"
import { GMeshList } from "z/sys/canvas/mesh-list"

export type ShaderContainer = {
	'prog': ShaderProg | null
}

export type FBOContainer = {
	'buf': FrameBuffer | null
}

export type DrawContainer = ["shader", ShaderContainer] | ["buf", FBOContainer]

type SquareTex = ["square"]
type CustomTex = ["custom", number[]]
export type TexType = SquareTex | CustomTex

export type RenderCont = {
	screen: XScreen,
	renderFlags: any,
	shaderDraw: (container: ShaderContainer, pMat: mat4, mvMat: mat4, s: Scene3d, params: any) => void,
	bufferDraw: (container: ShaderContainer, pMat: mat4, mvMat: mat4, s: Scene3d, params: any) => void,
	meshDraw: (container: ShaderContainer, pMat: mat4, mvMat: mat4, mName: string, texType: TexType, params: any) => void
}

export type RenderFunStore = {
	rFun: (cont: RenderCont, mvMat: mat4, s: Scene3d) => void,
	iData: any
}

var Z_MAT = mat4.create();

	/* functions for render arguments */

function useTexture(screen: XScreen, texDef: any[]) {
	switch (texDef[0]) {
		case 'buffer':
			var [_, bufContainer, bName, i] = texDef;
			if (bufContainer.buf !== null) {
				var buf = bufContainer.buf;
				useBufferTexture(screen.gl, buf, bName, i);
			}
			return;
		case 'tex':
			var gl = screen.gl;
			var [_, texImage, slotId] = texDef;
			gl.activeTexture(texNum(gl, slotId));
			gl.bindTexture(gl.TEXTURE_2D, texImage.texId);
			return;
	}
}

function useTexList(screen: XScreen, params: any) {
	if (params.loadTex === undefined) return;
	var texList = params.loadTex;
	for (let texDef of texList) {
		useTexture(screen, texDef);
	}
}

function buildCont(prog: ShaderProg, args: any): DrawCont {
	var uArgs: any[] = [];
	var uMap: any = {};
	if (args === undefined) return { 'shader': prog, 'uArgs': uArgs, 'uMap': uMap, 'alpha': 1.0, 'dirty': true };
	uArgs = args;
	for (let uArg of uArgs) {
		uMap[uArg[0]] = uArg;
	}
	return { 'shader': prog, 'uArgs': uArgs, 'uMap': uMap, 'alpha': 1.0, 'dirty': true };
}

	/* render functions */

function shaderDraw(cont: RenderCont, container: ShaderContainer, pMat: mat4, mvMat: mat4, s: Scene3d, params: any) {
	if (container.prog === null) return;
	var prog = container.prog;
	var screen = cont.screen;
	useShader(screen.gl, prog);
	clearShader(screen);
	// process args
	//procUniformArgs(screen, prog, params);
	useTexList(screen, params);
	procUniformArgs(screen, buildCont(prog, params.uArgs));
	var drawCont = buildCont(prog, params.flagArgs);
	// draw mesh
	setUniformMat(screen.gl, prog, prog.uPers, pMat);
	setUniformMat(screen.gl, prog, prog.uModel, mvMat);
	render3d(screen, drawCont, Z_MAT, s);
}

function initFrameBuffer(screen: XScreen, buf: FrameBuffer, params: any) {
	if (params.switch !== undefined) {
		if (params.switch.start) useFrameBuffer(screen.gl, buf);
		switchDrawBuffers(screen.gl, buf, params.switch.bufList);
	} else {
		useFrameBuffer(screen.gl, buf);
	}
	clearFrameBuffer(screen.gl, buf);
}

function bufferDraw(cont: RenderCont, container: FBOContainer, pMat: mat4, mvMat: mat4, s: Scene3d, params: any) {
	if (container.buf === null) return;
	var buf = container.buf;
	var screen = cont.screen;
	initFrameBuffer(screen, buf, params);
	// process args
	//procUniformArgs(screen, buf.shader, params);
	useTexList(screen, params);
	procUniformArgs(screen, buildCont(buf.shader, params.uArgs));
	var drawCont = buildCont(buf.shader, params.flagArgs);
	// draw mesh
	setUniformMat(screen.gl, buf.shader, buf.shader.uPers, pMat);
	setUniformMat(screen.gl, buf.shader, buf.shader.uModel, mvMat);
	render3d(screen, drawCont, Z_MAT, s);
}

function useContainer(screen: XScreen, container: DrawContainer, params: any): ShaderProg | null {
	switch (container[0]) {
		case "shader":
			if (container[1].prog === null) return null;
			var prog = container[1].prog;
			useShader(screen.gl, prog);
			clearShader(screen);
			return prog;
		case "buf":
			if (container[1].buf === null) return null;
			var buf = container[1].buf;
			initFrameBuffer(screen, buf, params);
			return buf.shader;
	}
}

function meshDraw(cont: RenderCont, container: DrawContainer, pMat: mat4, mvMat: mat4, mName: string, tBuf: TBuffer, params: any) {	
	var screen = cont.screen;
	var prog = useContainer(screen, container, params);
	if (prog === null) return;
	// find mesh
	var mesh = GMeshList.loadName(screen.gl, mName);
	if (mesh === null) return;
	// process args
	useTexList(screen, params);
	procUniformArgs(screen, buildCont(prog, params.uArgs));
	var drawCont = buildCont(prog, params.flagArgs);
	// draw mesh
	setUniformMat(screen.gl, prog, prog.uPers, pMat);
	setUniformMat(screen.gl, prog, prog.uModel, mvMat);
	drawMeshWithBuf(screen.gl, prog, Z_MAT, [1, 1, 1, 1], 0.0, mesh, tBuf);
}

export function RenderCont(iData: any, screen: XScreen): RenderCont {
	var sqBuf = makeTexBuffer(screen.gl, squareTexCoords(), "screen-square");
	var tBuf = makeTexBuffer(screen.gl, squareTexCoords(), "screen-custom");
	iData.screen = screen;
	iData.shaderDraw = function(container, pMat, mvMat, s, params) {
			shaderDraw(this, container, pMat, mvMat, s, params);
		};
	iData.bufferDraw = function(container, pMat, mvMat, s, params) {
			bufferDraw(this, container, pMat, mvMat, s, params);
		};
	iData.meshDraw = function(container, pMat, mvMat, mName, tType, params) {
		var xBuf = sqBuf;
		if (tType[0] === "custom") {
			updateTexBuffer(screen.gl, tBuf, tType[1], screen.gl.DYNAMIC_DRAW);
			xBuf = tBuf;
		}
		meshDraw(this, container, pMat, mvMat, mName, xBuf, params);
	};
	return iData;
}

export function RenderFunStore(): RenderFunStore {
	return { 'rFun': function() {}, 'iData': {} };
}