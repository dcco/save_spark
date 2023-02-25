
import { GL } from "z/shader/shader"
import { TBuffer, makeTexBuffer, updateTexBuffer, squareTexCoords } from "z/shader/buffer"
import { TexImage, fixedTexImage, defTexImage, buildTexImage } from "z/mat/texture"

export var TILE_SIZE = 16;

export type SpSheet = {
	dim: number,
	pos: [number, number],
	framesPerRow: number,
	frameSize: [number, number]
}

export type Sprite = {
	image: TexImage,
	sheetList: SpSheet[],
	tBuf: TBuffer,
	mx: number,
	my: number,
	offset: [number, number],
	offWidth: number
}

export function setTileSize(ts: number) {
	TILE_SIZE = ts;
}


export function paintTexCoords(image: TexImage, sheet: [number, number, number, number][]): number[] {
	var texCoords: number[] = [];
	for (let i = 0; i < sheet.length; i++) {
		var [tx, ty, pw, ph] = sheet[i];
		var cx = (tx * TILE_SIZE) / image.width;
		var cy = (ty * TILE_SIZE) / image.height;
		var cw = pw / image.width;
		var ch = ph / image.height;
		var fl = [
			cx, cy, cx + cw, cy + ch, cx + cw, cy,
			cx, cy, cx, cy + ch, cx + cw, cy + ch
		]
		texCoords = texCoords.concat(fl);
	}
	return texCoords;
}

export function frameTexCoords(image: TexImage, sheet: SpSheet, frame: number, facing: boolean): number[] {
	var i = Math.floor(frame % sheet.framesPerRow);
	var j = Math.floor(frame / sheet.framesPerRow);
	var sx = (sheet.pos[0] + (i * sheet.frameSize[0])) * sheet.dim / image.width;
	var sy = (sheet.pos[1] + (j * sheet.frameSize[1])) * sheet.dim / image.height;
	var w = (sheet.frameSize[0] * sheet.dim) / image.width;
	var h = (sheet.frameSize[1] * sheet.dim) / image.height;
	var [l, r] = [sx, sx + w];
	if (facing) {
		l = r;
		r = sx;
	}
	return [
		l, sy, r, sy + h, r, sy,
		l, sy, l, sy + h, r, sy + h
	];
}

export function frameListTexCoords(image: TexImage,
	sheetList: SpSheet[], frameList: [number, number][]): number[] {
	var texCoords: number[] = [];
	for (let i = 0; i < frameList.length; i++) {
		var [sheetId, frame] = frameList[i];
		texCoords = texCoords.concat(frameTexCoords(image, sheetList[sheetId], frame, false));
	}
	return texCoords;
}

export function makeSprite(gl: GL, texImage: TexImage, sheetList: SpSheet[]): Sprite {
	var tBuf = makeTexBuffer(gl, frameTexCoords(texImage, sheetList[0], 0, false), texImage.name);
	var ix = Math.ceil(sheetList[0].dim * sheetList[0].frameSize[0] / TILE_SIZE);
	var iy = Math.ceil(sheetList[0].dim * sheetList[0].frameSize[1] / TILE_SIZE);
	return { 'image': texImage, 'sheetList': sheetList, 'tBuf': tBuf, 'mx': ix, 'my': iy, 'offset': [0, 0], 'offWidth': ix };
}

export function makeDefSprite(gl: GL, texImage: TexImage) {
	var dim = Math.min(texImage.width, texImage.height);
	var sheetList: SpSheet[] = [{ 'dim': dim, 'pos': [0, 0], 'framesPerRow': 1, 'frameSize': [1, 1] }];
	return makeSprite(gl, texImage, sheetList);
}

export function setSpriteFrame(gl: GL, sprite: Sprite, frame: number, facing: boolean) {
	var texCoords = frameTexCoords(sprite.image, sprite.sheetList[0], frame, facing);
	updateTexBuffer(gl, sprite.tBuf, texCoords, gl.DYNAMIC_DRAW);
}

export function setSpriteFrameList(gl: GL, sprite: Sprite, frameList: [number, number][]) {
	var texCoords = frameListTexCoords(sprite.image, sprite.sheetList, frameList);
	updateTexBuffer(gl, sprite.tBuf, texCoords, gl.DYNAMIC_DRAW);
}

export function setPaintFrame(gl: GL, tBuf: TBuffer, image: TexImage, sheet: [number, number, number, number][]) {
	var texCoords = paintTexCoords(image, sheet);
	updateTexBuffer(gl, tBuf, texCoords, gl.DYNAMIC_DRAW);
}