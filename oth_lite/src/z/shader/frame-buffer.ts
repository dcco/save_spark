
import { GL, ShaderProg, Shader, useShader } from "z/shader/shader"

type BufferMap = {
	[name: string]: WebGLTexture
}

export type FrameBuffer = {
	shader: ShaderProg,
	width: number,
	height: number,
	fbo: WebGLFramebuffer,
	rbo: WebGLRenderbuffer | null,
	bufMap: BufferMap
}

export type BufferType = ['color' | 'alt-color' | 'depth' | 'render', string]

function attachNum(gl: GL, i: number) {
	switch (i) {
		case 1: return gl.COLOR_ATTACHMENT1;
		case 2: return gl.COLOR_ATTACHMENT2;
		case 3: return gl.COLOR_ATTACHMENT3;
		case 4: return gl.COLOR_ATTACHMENT4;
		case 5: return gl.COLOR_ATTACHMENT5;
		case 6: return gl.COLOR_ATTACHMENT6;
		case 7: return gl.COLOR_ATTACHMENT7;
		case 8: return gl.COLOR_ATTACHMENT8;
		case 9: return gl.COLOR_ATTACHMENT9;
		default:
			return gl.COLOR_ATTACHMENT0;
	}
}

export function texNum(gl: GL, i: number) {
	switch (i) {
		case 1: return gl.TEXTURE1;
		case 2: return gl.TEXTURE2;
		case 3: return gl.TEXTURE3;
		case 4: return gl.TEXTURE4;
		case 5: return gl.TEXTURE5;
		case 6: return gl.TEXTURE6;
		case 7: return gl.TEXTURE7;
		case 8: return gl.TEXTURE8;
		case 9: return gl.TEXTURE9;
		default:
			return gl.TEXTURE0;
	}
} 

function dummyData(w: number, h: number): number[]
{
	var z: number[] = [];
	for (let i = 0; i < w * h; i++) {
		z.push(0);
		z.push(0);
		z.push(0);
		z.push(0);
	}
	return z;
}

function makeColorBuffer(gl: GL, name: string, w: number, h: number, i: number | null): WebGLTexture
{
	var colorId = gl.createTexture();
	if (colorId === null) throw ("frame-buffer.js - Failed to initialize color buffer texture.");
	gl.bindTexture(gl.TEXTURE_2D, colorId);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0,
		gl.RGBA, gl.FLOAT, null
	);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	if (i !== null) gl.framebufferTexture2D(gl.FRAMEBUFFER, attachNum(gl, i), gl.TEXTURE_2D, colorId, 0);
	return colorId;
}

function makeDepthBuffer(gl: GL, name: string, w: number, h: number): WebGLTexture
{
	var depthId = gl.createTexture();
	if (depthId === null) throw ("frame-buffer.js - Failed to initialize depth buffer texture.");
	gl.bindTexture(gl.TEXTURE_2D, depthId);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, w, h, 0,
		gl.DEPTH_COMPONENT, gl.FLOAT, null
	);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthId, 0);
	//gl.drawBuffers([gl.NONE]);
	//gl.readBuffer(gl.NONE);
	return depthId;
}

export async function FrameBuffer(gl: GL, locale: string, sName: string, name: string, width: number, height: number, bufferList: BufferType[]): Promise<FrameBuffer> {
	// initialize shader + fbo
	var shader = await Shader(gl, locale, sName, name);
	// re-use to ensure no async interleaving
	gl.useProgram(shader.prog);
	var fbo = gl.createFramebuffer();
	if (fbo === null) throw ("frame-buffer.js - Failed to initialize frame buffer object.");
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

	// initialize buffers
	var bufferMap: BufferMap = {};
	var renderFlag = false;
	var colorTotal = 0;
	for (let i = 0; i < bufferList.length; i++) {
		var bufferType = bufferList[i];
		switch (bufferType[0]) {
			case 'color':
				var bufId = makeColorBuffer(gl, bufferType[1], width, height, colorTotal);
				bufferMap[bufferType[1]] = bufId;
				colorTotal = colorTotal + 1;
				break;
			case 'alt-color':
				var bufId = makeColorBuffer(gl, bufferType[1], width, height, null);
				bufferMap[bufferType[1]] = bufId;
				break;
			case 'depth':
				var bufId = makeDepthBuffer(gl, bufferType[1], width, height);
				bufferMap[bufferType[1]] = bufId;
				break;
			case 'render':
				renderFlag = true;
		}
	}

	// attach color buffers
	if (colorTotal > 0) {
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
		var colorArray: any[] = [];
		for (let i = 0; i < colorTotal; i++) {
			colorArray.push(attachNum(gl, i));
		}
		gl.drawBuffers(colorArray);
	}

	// create + attach render buffer if applicable
	var rbo: WebGLRenderbuffer | null = null;
	if (renderFlag) {
		rbo = gl.createRenderbuffer();
		if (rbo === null) throw ("frame-buffer.js - Failed to initialize render buffer.");
		gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);
	}

	// final check + return
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
		console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) );
		throw ("Loading `" + name + "` frame buffer incomplete.");
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return {
		'shader': shader,
		'width': width,
		'height': height,
		'fbo': fbo,
		'rbo': rbo,
		'bufMap': bufferMap
	};
}

export function useFrameBuffer(gl: GL, buf: FrameBuffer) {
	useShader(gl, buf.shader);
	gl.bindFramebuffer(gl.FRAMEBUFFER, buf.fbo);
}

export function clearFrameBuffer(gl: GL, buf: FrameBuffer) {
	gl.viewport(0, 0, buf.width, buf.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function useBufferTexture(gl: GL, buf: FrameBuffer, name: string, slotId: number) {
	gl.activeTexture(texNum(gl, slotId));
	gl.bindTexture(gl.TEXTURE_2D, buf.bufMap[name]);
}

export function switchDrawBuffers(gl: GL, buf: FrameBuffer, nameList: string[]) {
	gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, buf.fbo);
	var colorArray: any[] = [];
	for (let i = 0; i < nameList.length; i++) {
		var colorId = buf.bufMap[nameList[i]];
		gl.framebufferTexture2D(gl.FRAMEBUFFER, attachNum(gl, i), gl.TEXTURE_2D, colorId, 0);
		colorArray.push(attachNum(gl, i));
	}
	gl.drawBuffers(colorArray);
}