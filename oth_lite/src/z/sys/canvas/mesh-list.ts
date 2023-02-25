
import { GL } from "z/shader/shader"
import { TBuffer, makeTexBuffer, makeVertBuffer, makeNormBuffer, squareXVertices, squareYVertices, squareZVertices } from "z/shader/buffer"
import { Mesh, makeMesh } from "z/mat/mesh"

type MeshListIface = {
	init: (gl: GL) => void,
	spareBuf: TBuffer | null,
	data: { [name: string]: Mesh },
	loadSquareZ: (gl: GL, w: number, h: number, debugName: string | null) => Mesh,
	loadTestBox: (gl: GL) => Mesh,
	loadScreen: (gl: GL) => Mesh,
	loadName: (gl: GL, name: string) => Mesh | null
}

export const GMeshList: MeshListIface = {
	init: function(gl) {
		this.spareBuf = makeTexBuffer(gl, [], "spare mesh buffer");
	},
	spareBuf: null,
	data: {},
	loadSquareZ: function(gl, w, h, debugName) {
		var name = "sz_" + w + "_" + h;
		if (debugName === null) debugName = "square z " + w + "x" + h;
		if (this.data[name] === undefined) {
			var vs = squareZVertices([0, 0], [w, h], 0);
			var vBuf = makeVertBuffer(gl, vs, debugName);
			var nBuf = makeNormBuffer(gl, vs, debugName);
			var mesh = makeMesh(vBuf, nBuf);
			this.data[name] = mesh;
			return mesh;
		}
		return this.data[name];
	},
	loadTestBox: function(gl) {
		if (this.data["test_box"] === undefined) {
			var vs = squareYVertices([0, 0], [1, 1], 0);
			vs = vs.concat(squareZVertices([0, 0], [1, 1], 1));
			vs = vs.concat(squareZVertices([1, 0], [-1, 1], 0));
			vs = vs.concat(squareXVertices([0, 0], [1, 1], 0));
			vs = vs.concat(squareXVertices([1, 0], [-1, 1], 1));
			vs = vs.concat(squareYVertices([1, 0], [-1, 1], 1));
			var vBuf = makeVertBuffer(gl, vs, "test box");
			var nBuf = makeNormBuffer(gl, vs, "test box");
			var mesh = makeMesh(vBuf, nBuf);
			this.data["test_box"] = mesh;
			return mesh;
		}
		return this.data["test_box"];
	},
	loadScreen: function(gl) {
		if (this.data["screen"] === undefined) {
			var vs = squareZVertices([-1, -1], [2, 2], 0);
			var vBuf = makeVertBuffer(gl, vs, "screen");
			var nBuf = makeNormBuffer(gl, vs, "screen");
			var mesh = makeMesh(vBuf, nBuf);
			this.data["screen"] = mesh;
			return mesh;
		}
		return this.data["screen"];
	},
	loadName: function(gl, name) {
		switch (name) {
			case 'test_box':
				return this.loadTestBox(gl);
			case 'screen':
				return this.loadScreen(gl);
			default:
				if (this.data[name] !== undefined) {
					return this.data[name];
				}
				return null;
		}
	}
}

export function addMesh(gl: GL, name: string, vs: number[]) {
	var vBuf = makeVertBuffer(gl, vs, name);
	var nBuf = makeNormBuffer(gl, vs, name);
	GMeshList.data[name] = makeMesh(vBuf, nBuf);
}