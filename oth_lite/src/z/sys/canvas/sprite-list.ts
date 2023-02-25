
import { GL } from "z/shader/shader"
import { TILE_SIZE, Sprite, makeSprite, makeDefSprite } from "z/mat/sprite"
import { GImageList } from "z/sys/canvas/image-list"

type SpriteListIface = {
	data: { [name: string]: Sprite },
	get: (name: string) => Sprite | null
	complete: boolean
}

export const GSpriteList: SpriteListIface = {
	data: {},
	get: function(name) {
		if (this.data[name] !== undefined) {
			return this.data[name];
		} else if (!this.complete) {
			return null;
		} else {
			throw("sprite-list.js - Attempted to access non-existent texture " + name + ".");
		}
	},
	complete: false
}

export function addTileset(gl: GL, iName: string, sName: string, pos: [number, number], framesPerRow: number) {
	var image = GImageList.get(iName);
	var sprite = makeSprite(gl, image, [{
		'dim': TILE_SIZE,
		'pos': pos,
		'framesPerRow': framesPerRow,
		'frameSize': [1, 1]
	}]);
	GSpriteList.data[sName] = sprite;
}

export function addXSheet(gl: GL, iName: string, sName: string, pos: [number, number], framesPerRow: number, frameSize: [number, number]) {
	var image = GImageList.get(iName);
	var sprite = makeSprite(gl, image, [{
		'dim': TILE_SIZE,
		'pos': pos,
		'framesPerRow': framesPerRow,
		'frameSize': frameSize
	}]);
	GSpriteList.data[sName] = sprite;	
}

function checkPixel(c1: [number, number, number, number], c2: [number, number, number]) {
	return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] !== 0;
}

export function findOffset(image: ImageData, srcWidth: number, pos: [number, number], frameSize: [number, number]): [number, number, number] {
	var tx = pos[0] * TILE_SIZE;
	var ty = pos[1] * TILE_SIZE;
	var width = frameSize[0] * TILE_SIZE;
	var height = frameSize[1] * TILE_SIZE;
	var data = image.data;
	function findOff(): [number, number] {
		for (let i = tx; i < tx + width; i++) {
			for (let j = ty; j < ty + height; j++) {
				var c = (i + (j * srcWidth)) * 4;
				var color: [number, number, number, number] = [data[c], data[c + 1], data[c + 2], data[c + 3]];
				if (checkPixel(color, [127, 201, 255])) {
					return [i - tx, j - ty];
				}
			}
		}
		return [0, 0];
	}
	var [offX, offY] = findOff();
	for (let i = tx + offX + 1; i < tx + width; i++) {
		var j = (ty + offY);
		var c = (i + (j * srcWidth)) * 4;
		var color: [number, number, number, number] = [data[c], data[c + 1], data[c + 2], data[c + 3]];
		if (!checkPixel(color, [127, 201, 255])) {
			return [offX, offY, i - (tx + offX)];
		}
	}
	return [offX, offY, width - offX];
}

export function addSprite(gl: GL, iName: string, sName: string, pos: [number, number], framesPerRow: number, frameSize: [number, number],
	manualFlag: boolean, offset: [number, number, number]) {
	var image = GImageList.get(iName);
	var sprite = makeSprite(gl, image, [{
		'dim': TILE_SIZE,
		'pos': pos,
		'framesPerRow': framesPerRow,
		'frameSize': frameSize
	}]);
	if (manualFlag) {
		var [offX, offY, offWidth] = offset;
		sprite.offset = [offX, offY];
		sprite.offWidth = offWidth;
	} if (image.src !== null) {
		var [offX, offY, offWidth] = findOffset(image.src.imageData, image.width, pos, frameSize);
		sprite.offset = [offX, offY];
		sprite.offWidth = offWidth;
	}
	GSpriteList.data[sName] = sprite;	
}
