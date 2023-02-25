
import { GL, ShaderProg, Shader, addAttrib, addUniform, addUniformTex } from "z/shader/shader"

export type Settings = {
	projName: string,
	toc: boolean,
	width: number,
	height: number,
	zoom: number,
	pipeline: string,
	res?: {
		imageList?: string[],
		manualOffset?: boolean,
		spriteList?: any[],
		musicList?: [string, number][]
	},
	locale: string,
	shaderLocale: string
}

export type XScreen = {
	gl: GL,
	baseProg: ShaderProg,
	viewportWidth: number,
	viewportHeight: number
}

function initGL(canvas: HTMLCanvasElement): GL {
	try {
		var gl = canvas.getContext("webgl2", {antialias: false, premultipliedAlpha: false});
		if (gl === null) throw("screen.js - Could not load WebGL!");
		return gl as unknown as WebGL2RenderingContextStrict;
	} catch(e) {
		throw("screen.js - Could not load WebGL!\n" + e);
	}
}

export function disableDepth(gl: GL) {
	gl.disable(gl.DEPTH_TEST);
}

export function enableDepth(gl: GL) {
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
}

export async function XScreen(canvas: HTMLCanvasElement, settings: Settings): Promise<XScreen> {

	// initialize webGL
	var gl = initGL(canvas);

	// initialize webGL settings
	gl.clearColor(0.05, 0.05, 0.05, 1.0);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	//gl.enable(gl.ALPHA_TEST);
	//gl.alphaFunc(gl.GREATER, 0);

	gl.disable(gl.DEPTH_TEST);
	
	gl.getExtension('EXT_color_buffer_float');

	var baseProg = await Shader(gl, 'none', settings.shaderLocale, 'base2');
	addAttrib(gl, baseProg, 'aPos', 'aPos');
	addAttrib(gl, baseProg, 'aTex', 'aTex');
	addUniform(gl, baseProg, 'uMVMat', 'uObj');
	addUniform(gl, baseProg, 'uPMat', 'uPers');
	addUniform(gl, baseProg, 'uColor', 'uColor');
	addUniform(gl, baseProg, 'uSampler', 'uSampler');

	return {
		gl: gl,
		baseProg: baseProg,
		viewportWidth: settings.width,
		viewportHeight: settings.height
	};

}