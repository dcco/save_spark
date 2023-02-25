
import { mat4 } from "gl-matrix"

import { VBuffer } from "z/shader/buffer"
import { ShaderProg } from "z/shader/shader"
import { TexImage } from "z/mat/texture"
import { TILE_SIZE, Sprite, setSpriteFrame, setSpriteFrameList } from "z/mat/sprite"
import { Mesh, drawMesh } from "z/mat/mesh"
import { XScreen } from "z/main/screen"
import { GBox } from "z/sys/cb/gbox"
import { GText } from "z/sys/cb/text"
import { GSpriteList } from "z/sys/canvas/sprite-list"
import { GMeshList } from "z/sys/canvas/mesh-list"

export type DrawCont = {
	shader: ShaderProg,
	colorFlag: [number, number, number, number] | null
}

type CColor = [any, number, number, number]
type CBox4 = [any, number, number, number, number]

type SNop = ["nop"]
type SBox = ["box", CColor, number, CBox4]
type SOffset = ["offset", number, number, Scene]
type SList = ["list", Scene[]]
type SImage = ["image", string]
type SSprite = ["sprite", string, number, boolean]
type SColor = ["color", CColor, Scene]
type SColor4 = ["color4", CColor, number, Scene]
type SText = ["text", number, number, string]
type SCustomImage = ["custom", Mesh, Sprite, number]
export type Scene = SNop | SBox | SOffset | SList | SImage | SSprite | SColor | SColor4 | SText | SCustomImage


function toFloatColor(c: CColor, a: number): [number, number, number, number] {
	return [c[1] / 256.0, c[2] / 256.0, c[3] / 256.0, a];
}

const OFF_MAT = mat4.create();

export function render(screen: XScreen, cont: DrawCont, objMat: mat4, s: Scene) {
	switch (s[0]) {
		case "nop":
			return;
		case "box":
			if (GBox.data === null) return;
			var fc = toFloatColor(s[1], s[2]);
			var [_, x, y, w, h] = s[3];
			GBox.setVBuf(screen.gl, x, y, w, h);
			drawMesh(screen.gl, cont.shader, objMat, fc, 0.0, GBox.data.mesh, GBox.data.sprite);
			return;
		case "offset":
			var nMat = mat4.create();
			mat4.identity(OFF_MAT);
			mat4.translate(OFF_MAT, OFF_MAT, [s[1], s[2], 0.0]);
			mat4.multiply(nMat, objMat, OFF_MAT);
			render(screen, cont, nMat, s[3]);
			return;
		case "list":
			var list = s[1];
			for (var i = 0; i < list.length; i++) {
				render(screen, cont, objMat, list[i]);
			}
			return;
		case "image":
			return render(screen, cont, objMat, ["sprite", s[1], 0, false]);
		case "sprite":
			// find sprite + mesh
			var spriteN = GSpriteList.get(s[1]);
			if (spriteN === null) return;
			var facing = s[3];
			setSpriteFrame(screen.gl, spriteN, s[2], s[3]);
			var mesh = GMeshList.loadSquareZ(screen.gl, spriteN.mx * TILE_SIZE, spriteN.my * TILE_SIZE, spriteN.image.name);
			if (mesh === null) return;
			// calculate offset based on direction facing
			var offX = spriteN.offset[0];
			var frameWidth = spriteN.sheetList[0].frameSize[0] * TILE_SIZE;
			if (facing) offX = frameWidth - (offX + spriteN.offWidth);
			var nMat = mat4.create();
			mat4.copy(nMat, objMat);
			mat4.translate(nMat, nMat, [-offX, -spriteN.offset[1], 0.0]);
			// draw
			var color = cont.colorFlag;
			if (color === null) color = [1.0, 1.0, 1.0, 1.0];
			drawMesh(screen.gl, cont.shader, nMat, color, 1.0, mesh, spriteN);
			return;
		case "color":
			var oldColor = cont.colorFlag;
			cont.colorFlag = toFloatColor(s[1], 1.0);
			render(screen, cont, objMat, s[2]);
			cont.colorFlag = oldColor;
			return;
		case "color4":
			var oldColor = cont.colorFlag;
			cont.colorFlag = toFloatColor(s[1], s[2]);
			render(screen, cont, objMat, s[3]);
			cont.colorFlag = oldColor;
			return;
		case "text":
			render(screen, cont, objMat, GText.scene(s[1], s[2], s[3]));
			return;
		case "custom":
			var mesh = s[1];
			var sprite = s[2];
			setSpriteFrame(screen.gl, sprite, s[3], false);
			var color = cont.colorFlag;
			if (color === null) color = [1.0, 1.0, 1.0, 1.0];
			drawMesh(screen.gl, cont.shader, objMat, color, 0.0, mesh, sprite);
			return;
	}
}

/*
export function SCustomImage(mesh: Mesh, s: Sprite, frame: number): Scene {
	var r = {
		id: 'c-image',
		childList: [],
		draw: function(screen, cont, objMat) {
			setSpriteFrame(screen.gl, s, frame, false);
			drawMesh(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0], mesh, s);
		}
	};
	return r;
}

export function SImage(sName: string, frame: number, facing: boolean): Scene {
	var r = {
		id: 'image',
		childList: [],
		draw: function(screen, cont, objMat) {
			// find sprite + mesh
			var sprite = GSpriteList.get(sName);
			if (sprite === null) return;
			setSpriteFrame(screen.gl, sprite, frame, facing);
			var mesh = GMeshList.loadSquareZ(screen.gl, sprite.mx * TILE_SIZE, sprite.my * TILE_SIZE, sprite.image.name);
			// calculate offset based on direction facing
			var offX = sprite.offset[0];
			var frameWidth = sprite.sheetList[0].frameSize[0] * TILE_SIZE;
			if (facing) offX = frameWidth - (offX + sprite.offWidth);
			// apply adjust for shadow frame buffer
			var offZ = 0.0;
			if (cont.shadowFlag) offZ = -0.1;
			var nMat = mat4.create();
			mat4.copy(nMat, objMat);
			mat4.translate(nMat, nMat, [-offX / TILE_SIZE, -sprite.offset[1] / TILE_SIZE, offZ]);
			// draw
			drawMesh(screen.gl, cont.shader, nMat, [1.0, 1.0, 1.0], mesh, sprite);
		}
	};
	return r;
};

const OFF_MAT = mat4.create();

export function SOffset(x: number, y: number, s: Scene): Scene {
	var r = {
		id: 'off_' + x + "_" + y,
		childList: [s],
		draw: function(screen, cont, objMat) {
			var nMat = mat4.create();
			mat4.identity(OFF_MAT);
			mat4.translate(OFF_MAT, OFF_MAT, [x, y, 0.0]);
			mat4.multiply(nMat, objMat, OFF_MAT);
			//mat4.copy(nMat, objMat);
			//mat4.translate(nMat, nMat, [x, y, 0.0]);
			s.draw(screen, cont, nMat);
		}
	};
	return r;
};

const S_MAT = mat4.create();

export function SScale(fx: number, fy: number, s: Scene): Scene {
	var r = {
		id: 'scale_' + fx + "_" + fy,
		childList: [s],
		draw: function(screen, cont, objMat) {
			var nMat = mat4.create();
			mat4.identity(S_MAT);
			mat4.scale(S_MAT, S_MAT, [fx, fy, 0.0]);
			mat4.multiply(nMat, objMat, S_MAT);
			//mat4.copy(nMat, objMat);
			//mat4.scale(nMat, nMat, [fx, fy, 0.0]);
			s.draw(screen, cont, nMat);
		}
	};
	return r;
};

export function SList(list: Scene[]): Scene {
	var r = {
		id: 'list',
		childList: list,
		draw: function(screen, cont, objMat) {
			var s = GSpriteList.get("test_box");
			for (var i = 0; i < list.length; i++) {
				list[i].draw(screen, cont, objMat);
			}
		}
	};
	return r;
};

export const SNop: Scene = {
	id: 'nop',
	childList: [],
	draw: function() {}
};*/

/*
function toFloatColor(c: [number, number, number]): [number, number, number] {
	return [c[0] / 256.0, c[1] / 256.0, c[2] / 256.0];
}

export function SBox(color: [number, number, number], x: number, y: number, w: number, h: number): Scene {
	var r = {
		id: 'image',
		childList: [],
		draw: function(screen, cont, objMat) {
			if (GBox.data === null) return;
			var fc = toFloatColor(color);
			GBox.setVBuf(screen.gl, x, y, w, h);
			drawMesh(screen.gl, cont.shader, objMat, fc, GBox.data.mesh, GBox.data.sprite);
		}
	};
	return r;
};*/