
import { mat4 } from "gl-matrix"

import { BASE2_F_SHADER, BASE2_V_SHADER } from "z/shader/base2"
import { ItemSize } from "z/shader/buffer"
import { XScreen } from "z/main/screen"
import { IGNORE_DIR } from "z/parse/fetch"

type SpecialLoc = 'aPos' | 'aTex' | 'aNorm' | 'uPers' | 'uModel' | 'uObj' | 'uSampler' | 'uColor' | 'uSprite'

export type GL = WebGL2RenderingContextStrict

export type ShaderProg = {
	name: string,
	prog: WebGLProgram,
	aPos: string | null,
	aTex: string | null,
	aNorm: string | null,
	uPers: string | null,
	uModel: string | null,
	uObj: string | null,
	uSampler: string | null,
	uColor: string | null,
	uSprite: string | null,

	aList: {
		[name: string]: GLint
	},
	uList: {
		[name: string]: WebGLUniformLocation
	}
}

async function loadShaderSrc(locale: string, sName: string, name: string): Promise<[string, string]> {
	var fName = '/' + locale + 'shader/' + sName + "/" + name + '.fs';
	var vName = '/' + locale + 'shader/' + sName + "/" + name + '.vs';
	if (IGNORE_DIR) {
		fName = 'shader/' + sName + "/" + name + '.fs';
		vName = 'shader/' + sName + "/" + name + '.vs';
	}
	var fText = await fetch(fName).then(response => response.text());
	var vText = await fetch(vName).then(response => response.text());
	return [fText, vText];
}

export function getShader(gl: GL, str: string, sType: GL['FRAGMENT_SHADER'] | GL['VERTEX_SHADER']): WebGLShader {
	// compile shader
	var shader = gl.createShader(sType);
	if (shader === null) throw("shader.js - Failed to initialize shader.");
	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	// check whether shader compiled
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log("Failed to compile shader.");
		throw("shader.js - " + gl.getShaderInfoLog(shader));
	}
	return shader;
}

export async function Shader(gl: GL, locale: string, sName: string, name: string): Promise<ShaderProg> {

	// compile shader code
	var shaderSrc = [BASE2_F_SHADER, BASE2_V_SHADER];
	if (name !== 'base2') shaderSrc = await loadShaderSrc(locale, sName, name);
	var [fText, vText] = shaderSrc;

	var fragShader = getShader(gl, fText, gl.FRAGMENT_SHADER);
	var vertexShader = getShader(gl, vText, gl.VERTEX_SHADER);

	// create shader program
	var shaderProg = gl.createProgram();
	if (shaderProg === null) throw("shader.js - Could not create shader program!");
	gl.attachShader(shaderProg, vertexShader);
	gl.attachShader(shaderProg, fragShader);
	gl.linkProgram(shaderProg);

	if (!gl.getProgramParameter(shaderProg, gl.LINK_STATUS)) {
		throw("shader.js - Could not initialize shaders.");
	}
	gl.useProgram(shaderProg);

	return {
		'name': name,
		'prog': shaderProg,
		'aPos': null, 'aTex': null, 'aNorm': null,
		'uPers': null, 'uModel': null, 'uObj': null,
		'uSampler': null, 'uColor': null, 'uSprite': null,
		'aList': {}, 'uList': {}
	};

}

export function useShader(gl: GL, shader: ShaderProg) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(shader.prog);
}

export function clearShader(screen: XScreen) {
	var gl = screen.gl;
	gl.viewport(0, 0, screen.viewportWidth, screen.viewportHeight);
	gl.clearColor(0.45, 0.45, 0.55, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function clearShaderS(screen: XScreen) {
	var gl = screen.gl;
	gl.viewport(0, 0, screen.viewportWidth, screen.viewportHeight);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function addAttrib(gl: GL, shader: ShaderProg, name: string, spec?: SpecialLoc): ShaderProg {
	if (spec !== undefined) shader[spec] = name;
	var aLoc = gl.getAttribLocation(shader.prog, name);
	if (aLoc === null) throw("shader.js - Could not get shader attribute location `" + name + "`.");
	gl.enableVertexAttribArray(aLoc);
	shader.aList[name] = aLoc;
	return shader;
}

export function addUniform(gl: GL, shader: ShaderProg, name: string, spec?: SpecialLoc): ShaderProg {
	if (spec !== undefined) shader[spec] = name;
	var uLoc = gl.getUniformLocation(shader.prog, name);
	if (uLoc === null) throw("shader.js - Could not get shader uniform location `" + name + "`.");
	shader.uList[name] = uLoc;
	return shader;
}

export function addUniformTex(gl: GL, shader: ShaderProg, name: string, i: number): ShaderProg {
	var uLoc = gl.getUniformLocation(shader.prog, name);
	gl.uniform1i(uLoc, i);
	return shader;
}

export function setAttribVec(gl: GL, shader: ShaderProg, name: string | null, buf: WebGLBuffer, size: ItemSize)
{
	if (name === null) return;
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.vertexAttribPointer(shader.aList[name], size, gl.FLOAT, false, 0, 0);
}

export function setUniformMat(gl: GL, shader: ShaderProg, name: string | null, mat: mat4) {
	if (name === null) return;
	gl.uniformMatrix4fv(shader.uList[name], false, mat);
}

export function setUniform1f(gl: GL, shader: ShaderProg, name: string | null, c: number) {
	if (name === null) return;
	gl.uniform1f(shader.uList[name], c);
}

export function setUniform3f(gl: GL, shader: ShaderProg, name: string | null, c: [number, number, number]) {
	if (name === null) return;
	gl.uniform3f(shader.uList[name], c[0], c[1], c[2]);
}

export function setUniform4f(gl: GL, shader: ShaderProg, name: string | null, c: [number, number, number, number]) {
	if (name === null) return;
	gl.uniform4f(shader.uList[name], c[0], c[1], c[2], c[3]);
}

export function setUniform3fv(gl: GL, shader: ShaderProg, name: string, fv: number[], i: number) {
	var sampleLoc = gl.getUniformLocation(shader.prog, name + '[' + i + ']');
	gl.uniform3fv(sampleLoc, fv);
}