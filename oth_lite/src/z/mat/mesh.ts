
import { mat4 } from "gl-matrix"

import { GL, ShaderProg, setAttribVec, setUniformMat, setUniform4f, setUniform1f } from "z/shader/shader"
import { TBuffer, VBuffer, NBuffer, squareZVertices, makeNormBuffer } from "z/shader/buffer"
import { TexImage, TexId } from "z/mat/texture"
import { Sprite } from "z/mat/sprite"

export type Mesh = {
	vBuf: VBuffer,
	nBuf: NBuffer
}

export function drawVBuf(gl: GL, shader: ShaderProg, objMat: mat4,
	color: [number, number, number, number], tBuf: TBuffer, vBuf: VBuffer, texImage: TexImage) {
	setAttribVec(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
	setAttribVec(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texImage.texId);

	setUniformMat(gl, shader, shader.uObj, objMat);
	setUniform4f(gl, shader, shader.uColor, color);
	gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
}

export function drawMesh(gl: GL, shader: ShaderProg, objMat: mat4,
	color: [number, number, number, number], spFlag: number, mesh: Mesh, sprite: Sprite) {
	var tBuf = sprite.tBuf;
	var vBuf = mesh.vBuf;
	var nBuf = mesh.nBuf;

	setAttribVec(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
	setAttribVec(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
	setAttribVec(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sprite.image.texId);
	
	setUniformMat(gl, shader, shader.uObj, objMat);
	setUniform1f(gl, shader, shader.uSprite, spFlag);
	setUniform4f(gl, shader, shader.uColor, color);

	gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
}

export function drawMeshWithBuf(gl: GL, shader: ShaderProg, objMat: mat4,
	color: [number, number, number, number], spFlag: number, mesh: Mesh, tBuf: TBuffer) {
	var vBuf = mesh.vBuf;
	var nBuf = mesh.nBuf;

	setAttribVec(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
	setAttribVec(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
	setAttribVec(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);

	setUniformMat(gl, shader, shader.uObj, objMat);
	setUniform1f(gl, shader, shader.uSprite, spFlag);
	setUniform4f(gl, shader, shader.uColor, color);

	gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
}


export function drawMeshWithImageBuf(gl: GL, shader: ShaderProg, objMat: mat4,
	color: [number, number, number, number], spFlag: number, mesh: Mesh, image: TexImage, tBuf: TBuffer) {
	var vBuf = mesh.vBuf;
	var nBuf = mesh.nBuf;

	setAttribVec(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
	setAttribVec(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
	setAttribVec(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, image.texId);
	
	setUniformMat(gl, shader, shader.uObj, objMat);
	setUniform1f(gl, shader, shader.uSprite, spFlag);
	setUniform4f(gl, shader, shader.uColor, color);

	gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
}

export function makeMesh(vBuf: VBuffer, nBuf: NBuffer): Mesh {
	return { 'vBuf': vBuf, 'nBuf': nBuf };
}

type ConstNBuf = {
	data: NBuffer | null
}

const FlatNBuffer: ConstNBuf = {
	data: null
}

export function make2DMesh(gl: GL, vBuf: VBuffer): Mesh {
	if (FlatNBuffer.data === null) {
		var vs = squareZVertices([0, 0], [1, 1], 0);
		var nBuf = makeNormBuffer(gl, vs, "generic 2d normal buffer");
		FlatNBuffer.data = nBuf;
	}
	return { 'vBuf': vBuf, 'nBuf': FlatNBuffer.data };
}
