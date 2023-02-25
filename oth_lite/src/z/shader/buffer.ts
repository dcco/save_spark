
import { GL } from "z/shader/shader"

export type ItemSize = 1 | 2 | 3 | 4

export type TBuffer = {
	data: WebGLBuffer,
	itemSize: ItemSize
}

export type VBuffer = {
	data: WebGLBuffer,
	itemSize: ItemSize,
	numItems: number
}

export type NBuffer = {
	data: WebGLBuffer,
	itemSize: ItemSize
}

	/* texture buffer manipulation functions */

export function squareTexCoords(): number[] {
	return [
		0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0, 1.0, 1.0
	];
}

export function makeTexBuffer(gl: GL, texCoords: number[], name: string): TBuffer {
	var rawBuf = gl.createBuffer();
	if (rawBuf === null) throw("buffer.js - Failed to create texture coordinate buffer for " + name + ".");
	var tBuf: TBuffer = {
		data: rawBuf,
		itemSize: 2
	};
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuf.data);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	return tBuf;
}

export function updateTexBuffer(gl: GL, tBuf: TBuffer,
	texCoords: number[], dType: GL['STATIC_DRAW'] | GL['DYNAMIC_DRAW']) {
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuf.data);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), dType);
}

	/* vertex buffer manipulation functions */

	// must give the vertices in ccw order
export function quadVertices(p1: [number, number, number], p2: [number, number, number],
	p3: [number, number, number], p4: [number, number, number]): number[] {
	return [
		p1[0], p1[1], p1[2],
		p2[0], p2[1], p2[2],
		p3[0], p3[1], p3[2],
		p1[0], p1[1], p1[2],
		p3[0], p3[1], p3[2],
		p4[0], p4[1], p4[2]
	];
}

export function squareZVertices(pos: [number, number], size: [number, number], z: number): number[] {
	var l = pos[0];
	var r = pos[0] + size[0];
	var t = pos[1];
	var b = pos[1] + size[1];
	return [
		l, t, z,
		r, b, z,
		r, t, z,
		l, t, z,
		l, b, z,
		r, b, z
	];
}

export function squareXVertices(pos: [number, number], size: [number, number], x: number): number[] {
	var l = pos[0];
	var r = pos[0] + size[0];
	var t = pos[1];
	var b = pos[1] + size[1];
	return [
		x, t, l,
		x, b, r,
		x, t, r,
		x, t, l, 
		x, b, l,
		x, b, r
	];
}

export function squareYVertices(pos: [number, number], size: [number, number], y: number): number[] {
	var l = pos[0];
	var r = pos[0] + size[0];
	var t = pos[1];
	var b = pos[1] + size[1];
	return [
		l, y, t,
		r, y, b,
		r, y, t,
		l, y, t,
		l, y, b,
		r, y, b
	];
}

export function makeVertBuffer(gl: GL, vertices: number[], name: string): VBuffer {
	var rawBuf = gl.createBuffer();
	if (rawBuf === null) throw("buffer.js - Failed to create vertex buffer for `" + name + "`.");
	var vBuf: VBuffer = {
		data: rawBuf,
		itemSize: 3,
		numItems: Math.floor(vertices.length / 3)
	};
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuf.data);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	return vBuf;
}

export function updateVertBuffer(gl: GL, vBuf: VBuffer,
	vertices: number[], dType: GL['STATIC_DRAW'] | GL['DYNAMIC_DRAW']) {
	vBuf.numItems = Math.floor(vertices.length / vBuf.itemSize);
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuf.data);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), dType);
}

function getNorm(i: [number, number, number], j: [number, number, number], k: [number, number, number]): [number, number, number]
{
	var a = [k[0] - i[0], k[1] - i[1], k[2] - i[2]];
	var b = [j[0] - i[0], j[1] - i[1], j[2] - i[2]];
	return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function vertToNormList(vs: number[]): number[]
{
	var normList: number[] = [];
	var vertNumber = Math.floor(vs.length / 9);
	for (let i = 0; i < vertNumber; i++) {
		var ix = i * 9;
		var [n1, n2, n3] = getNorm([vs[ix], vs[ix + 1], vs[ix + 2]],
			[vs[ix + 3], vs[ix + 4], vs[ix + 5]], [vs[ix + 6], vs[ix + 7], vs[ix + 8]]);
		var mag = Math.sqrt(n1 * n1 + n2 * n2 + n3 * n3);
		n1 = n1 / mag;
		n2 = n2 / mag;
		n3 = n3 / mag;
		for (let j = 0; j < 3; j++) {
			normList.push(n1);
			normList.push(n2);
			normList.push(n3);
		}
	}
	return normList;
}

export function makeNormBuffer(gl: GL, vertices: number[], name: string): NBuffer {
	var rawBuf = gl.createBuffer();
	if (rawBuf === null) throw("buffer.js - Failed to create normal buffer for `" + name + "`.");
	var nBuf: NBuffer = {
		data: rawBuf,
		itemSize: 3
	};
	var normList = vertToNormList(vertices);
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuf.data);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW);
	return nBuf;
}
