
import { GL, Shader, ShaderProg, addAttrib, addUniform, addUniformTex } from "z/shader/shader"
import { FrameBuffer, BufferType } from "z/shader/frame-buffer"
import { ShaderContainer, FBOContainer } from "z/sys/canvas/shader-wrap"

type ShaderReq = { req: 'shader', container: ShaderContainer, pName: string, settings: any }
type FBOReq = { req: 'fbo', container: FBOContainer, pName: string, settings: any }
type ShaderObjReq = ShaderReq | FBOReq

var shaderList: ShaderObjReq[] = [];

function completeShader(gl: GL, prog: ShaderProg, settings: any) {
	// add attributes
	var attrList = settings.attrList;
	if (attrList.pos !== undefined) addAttrib(gl, prog, attrList.pos, 'aPos');
	if (attrList.tex !== undefined) addAttrib(gl, prog, attrList.tex, 'aTex');
	if (attrList.norm !== undefined) addAttrib(gl, prog, attrList.norm, 'aNorm');
	// add uniforms
	var unifList = settings.uniformList;
	if (unifList.objMat !== undefined) addUniform(gl, prog, unifList.objMat, 'uObj');
	if (unifList.modelMat !== undefined) addUniform(gl, prog, unifList.modelMat, 'uModel');
	if (unifList.persMat !== undefined) addUniform(gl, prog, unifList.persMat, 'uPers');
	if (unifList.sampler !== undefined) addUniform(gl, prog, unifList.sampler, 'uSampler');
	if (unifList.spriteFlag !== undefined) addUniform(gl, prog, unifList.spriteFlag, 'uSprite');
	if (unifList.color !== undefined) addUniform(gl, prog, unifList.color, 'uColor');
	if (unifList.extra !== undefined) {
		for (let uName of unifList.extra) {
			addUniform(gl, prog, uName);
		}
	}
	if (unifList.flagList !== undefined) {
		for (let uName of unifList.flagList) {
			addUniform(gl, prog, uName);
		}
	}
	// add uniform textures
	var uTexList = settings.uTexList;
	if (uTexList !== undefined) {
		var i = 0;
		for (let uTex of uTexList) {
			addUniformTex(gl, prog, uTex, i);
			i = i + 1;
		}
	}
}

async function shaderCompInit(container: ShaderContainer, gl: GL, locale: string, pName: string, settings: any) {
	var name = settings.name;
	var prog = await Shader(gl, locale, pName, name);
	completeShader(gl, prog, settings);
	container.prog = prog;
}

export function shaderComp(gl: GL, locale: string, pName: string, settings: any): ShaderContainer
{
	var container = { 'prog': null };
	console.log(settings.name);
	shaderList.push({ 'req': 'shader', 'container': container, 'pName': pName, 'settings': settings });
	//shaderCompInit(container, gl, locale, pName, settings);
	return container;
}

function buildBufList(backingList: any[]): BufferType[] {
	var bufList: BufferType[] = [];
	for (let backer of backingList) {
		switch (backer[0]) {
			case "depth":
			case "color":
				bufList.push([backer[0], backer[1]]);
				break;
			case "render":
				bufList.push([backer[0], ""]);
				break;
			case "altColor":
				bufList.push(["alt-color", backer[1]]);
				break;
		}
	}
	return bufList;
}

async function fboCompInit(container: FBOContainer, gl: GL, locale: string, pName: string, settings: any) {
	var name = settings.name;
	var size = settings.size;
	var bufferList = buildBufList(settings.backingList);
	var buffer = await FrameBuffer(gl, locale, pName, name, size[1], size[2], bufferList);
	completeShader(gl, buffer.shader, settings);
	container.buf = buffer;
}

export function frameBufferComp(gl: GL, locale: string, pName: string, settings: any): FBOContainer
{
	var container = { 'buf': null };
	console.log(settings.name);
	shaderList.push({ 'req': 'fbo', 'container': container, 'pName': pName, 'settings': settings });
	//fboCompInit(container, gl, locale, pName, settings);
	return container;
}

export async function shaderListInit(gl: GL, locale: string)
{
	for (let i = 0; i < shaderList.length; i++) {
		var shaderReq = shaderList[i];
		console.log('init shader: ' + shaderReq.settings.name);
		if (shaderReq.req === 'shader') {
			await shaderCompInit(shaderReq.container, gl, locale, shaderReq.pName, shaderReq.settings);
		} else {
			await fboCompInit(shaderReq.container, gl, locale, shaderReq.pName, shaderReq.settings);
		}
		console.log('complete shader: ' + shaderReq.settings.name);
	}
}