
import { VBuffer, makeVertBuffer, squareZVertices } from "z/shader/buffer"
import { TexImage, buildTexImage } from "z/mat/texture"
import { Sprite, makeSprite } from "z/mat/sprite"
import { Mesh, make2DMesh } from "z/mat/mesh"
import { loadImage } from "z/sys/canvas/image-list"
import { Scene } from "z/sys/canvas/scene"

type TextData = {
	sprite: Sprite,
	mesh: Mesh
}

export type TextIface = {
	data: TextData | null,
	init: (HTMLCanvasElement, GL) => void
	scene: (number, numer, string) => Scene
}

function schar(tData: TextData, c: string): Scene {
	var i = c.charCodeAt(0) - 32;
	if (i < 0 || i >= 65) return ["nop"];
	return ["custom", tData.mesh, tData.sprite, i];
}

export const GText: TextIface = {
	data: null,
	init: async function(canvas, gl) {
		// load text image
		var webImage = await loadImage(gl, "text.png");
		var image = buildTexImage(gl, webImage, canvas);
		var sprite = makeSprite(gl, image, [
			{ 'dim': 8, 'pos': [0, 0], 'framesPerRow': 13, 'frameSize': [1, 1]}
		]);
		// special buffer image for characters of text
		var vertices = squareZVertices([0, 0], [8, 8], 0);
		var vBuf = makeVertBuffer(gl, vertices, "text display");
		var mesh = make2DMesh(gl, vBuf);
		this.data = {
			'sprite': sprite,
			'mesh': mesh
		};
	},
	scene: function(x, y, text) {
		if (this.data === null) return ["nop"];
		var tData = this.data;
		var drawList: Scene[] = [];
		for (var i = 0; i < text.length; i++) {
			var c = text.charAt(i);
			drawList.push(["offset", x + (i * 4.0), y, schar(tData, c)]);
		}
		return ["list", drawList];
	}
}

