
import { GL, ShaderProg } from "z/shader/shader"
import { makeVertBuffer, updateVertBuffer, squareZVertices } from "z/shader/buffer"
import { TexImage, defTexImage } from "z/mat/texture"
import { Sprite, makeDefSprite } from "z/mat/sprite"
import { Mesh, make2DMesh } from "z/mat/mesh"

export type BoxData = {
	sprite: Sprite,
	mesh: Mesh,
}

export type BoxIface = {
	data: BoxData | null,
	init: (gl: GL) => void,
	setVBuf: (gl: GL, x: number, y: number, w: number, h: number) => void
}

export const GBox: BoxIface = {
	data: null,
	init: function(gl) {
		var vertices = squareZVertices([0, 0], [1, 1], 0);
		var vBuf = makeVertBuffer(gl, vertices, "default texture");
		var sprite = makeDefSprite(gl, defTexImage(gl));
		var mesh = make2DMesh(gl, vBuf);
		this.data = {
			'sprite': sprite,
			'mesh': mesh
		};
	},
	setVBuf: function(gl, x, y, w, h) {
		if (this.data === null) return;
		var vBuf = this.data.mesh.vBuf;
		var vertices = squareZVertices([x, y], [w, h], 0);
		updateVertBuffer(gl, vBuf, vertices, gl.DYNAMIC_DRAW);
	}
}
