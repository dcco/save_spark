
import { mat4 } from "gl-matrix"

import { GL, useShader, clearShaderS, setUniformMat } from "z/shader/shader"
import { DrawCont, Scene, render } from "z/sys/canvas/scene"
import { Settings, XScreen } from "z/main/screen"

import { GText } from "z/sys/cb/text"

const MV_MAT = mat4.create();

type BaseShader = {
	pMat: mat4,
	mvMat: mat4
}

export function BaseShader(settings: Settings): BaseShader {
	var pMat = mat4.create();
	mat4.ortho(pMat, 0.0, settings.width, settings.height, 0.0, -1.0, 1.0);
	var mvMat = mat4.create();
	return {
		'pMat': pMat, 'mvMat': mvMat
	};
}

export function base2Draw(screen: XScreen, shader: BaseShader, scene: Scene) {
	var gl = screen.gl;
	var shaderProg = screen.baseProg;

	// equip shader
	useShader(gl, shaderProg);
	clearShaderS(screen);

	// write to perspective / model-view matrix
	setUniformMat(gl, shaderProg, shaderProg.uPers, shader.pMat);
	render(screen, { 'shader': shaderProg, 'colorFlag': null }, shader.mvMat, scene);
}

export function base2Equip(screen: XScreen, shader: BaseShader) {
	var gl = screen.gl;
	var shaderProg = screen.baseProg;
	// equip shader
	useShader(gl, shaderProg);
	setUniformMat(gl, shaderProg, shaderProg.uPers, shader.pMat);
}