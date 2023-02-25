
import { mat4 } from "gl-matrix"

import { VBuffer } from "z/shader/buffer"
import { ShaderProg, setUniformMat, setUniform1f, setUniform3fv } from "z/shader/shader"
import { TexImage } from "z/mat/texture"
import { TILE_SIZE, Sprite, setSpriteFrame, setSpriteFrameList, setPaintFrame } from "z/mat/sprite"
import { Mesh, drawMesh, drawMeshWithImageBuf } from "z/mat/mesh"
import { XScreen } from "z/main/screen"
import { GBox } from "z/sys/cb/gbox"
import { GText } from "z/sys/cb/text"
import { GImageList } from "z/sys/canvas/image-list"
import { GSpriteList } from "z/sys/canvas/sprite-list"
import { GMeshList } from "z/sys/canvas/mesh-list"

export type DrawCont = {
	shader: ShaderProg,
	uArgs: any[],
	uMap: any,
	alpha: number,
	dirty: boolean
}

type S3Nop = ["nop"]
type S3Sprite = ["sprite", string, number, boolean]
type S3Mesh = ["mesh", string, string, number[]]
type S3MeshPaint = ["meshPaint", string, string, [number, number, number, number][]]
type S3Offset = ["offset", number, number, number, Scene3d]
type S3RotateY = ["rotate", number, Scene3d]
type S3List = ["list", Scene3d[]]
type S3Alpha = ["alpha", number, Scene3d]
type S3Flag = ["flag", string, number, Scene3d]
export type Scene3d = S3Nop | S3Sprite | S3Mesh | S3MeshPaint | S3Offset | S3RotateY | S3List | S3Alpha | S3Flag

const OFF_MAT = mat4.create();

export function procUniformArgs(screen: XScreen, cont: DrawCont) {
	var uArgs = cont.uArgs;
	if (cont.dirty === false || uArgs.length === 0) return;
	var prog = cont.shader;
	var uMap = cont.uMap;
	for (let uArg of uArgs) {
		var uValue = uMap[uArg[0]][2];
		switch (uArg[1]) {
			case 'mat':
				setUniformMat(screen.gl, prog, uArg[0], uValue);
				break;
			case '1f':
				setUniform1f(screen.gl, prog, uArg[0], uValue);
				break;
			case '3f-list':
				for (let i = 0; i < uValue.length; i++) {
					var v = uValue[i];
					setUniform3fv(screen.gl, prog, uArg[0], [v[0], v[1], v[2]], i);
				}
				break;
		}
	}
	cont.dirty = false;
}

export function render3d(screen: XScreen, cont: DrawCont, objMat: mat4, s: Scene3d) {
	switch (s[0]) {
		case "nop":
			return;
		case "offset":
			var nMat = mat4.create();
			mat4.identity(OFF_MAT);
			mat4.translate(OFF_MAT, OFF_MAT, [s[1], s[2], s[3]]);
			mat4.multiply(nMat, objMat, OFF_MAT);
			render3d(screen, cont, nMat, s[4]);
			return;
		case "rotate":
			var nMat = mat4.create();
			mat4.rotateY(nMat, objMat, (s[1] * Math.PI) / 180);
			render3d(screen, cont, nMat, s[2]);
			return;
		case "list":
			var list = s[1];
			for (var i = 0; i < list.length; i++) {
				render3d(screen, cont, objMat, list[i]);
			}
			return;
		case "mesh":
			var sprite = GSpriteList.get(s[2]);
			if (sprite === null) return;
			var meshN = GMeshList.loadName(screen.gl, s[1]);
			if (meshN === null) return;
			var flx: [number, number][] = s[3].map((i) => [0, i])
			setSpriteFrameList(screen.gl, sprite, flx);
			procUniformArgs(screen, cont);
			drawMesh(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0, cont.alpha], 0.0, meshN, sprite);
			return;
		case "meshPaint":
			var image = GImageList.get(s[2]);
			if (image === undefined) return;
			var tBuf = GMeshList.spareBuf;
			if (tBuf === null) return;
			var meshN = GMeshList.loadName(screen.gl, s[1]);
			if (meshN === null) return;
			setPaintFrame(screen.gl, tBuf, image, s[3]);
			procUniformArgs(screen, cont);
			drawMeshWithImageBuf(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0, cont.alpha], 0.0, meshN, image, tBuf);
			return;
		case "sprite":
			// find sprite + mesh
			var sprite = GSpriteList.get(s[1]);
			if (sprite === null) return;
			var facing = s[3];
			setSpriteFrame(screen.gl, sprite, s[2], s[3]);
			var mesh = GMeshList.loadSquareZ(screen.gl, sprite.mx, sprite.my, sprite.image.name);
			if (mesh === null) return;
			// calculate offset based on direction facing
			var offX = sprite.offset[0];
			var frameWidth = sprite.sheetList[0].frameSize[0] * TILE_SIZE;
			if (facing) offX = frameWidth - (offX + sprite.offWidth);
			// apply adjustments
			var nMat = mat4.create();
			mat4.copy(nMat, objMat);
			mat4.translate(nMat, nMat, [-offX / TILE_SIZE, -sprite.offset[1] / TILE_SIZE, 0.0]);
			// draw
			procUniformArgs(screen, cont);
			drawMesh(screen.gl, cont.shader, nMat, [1.0, 1.0, 1.0, cont.alpha], 1.0, mesh, sprite);
			return;
		case "alpha":
			var oldAlpha = cont.alpha;
			cont.alpha = s[1];
			render3d(screen, cont, objMat, s[2]);
			cont.alpha = oldAlpha;
			return;
		case "flag":
			var flagName = s[1];
			if (cont.uMap[flagName] !== undefined) {
				var oldValue = cont.uMap[flagName][2];
				cont.uMap[flagName][2] = s[2];
				cont.dirty = true;
				render3d(screen, cont, objMat, s[3]);
				cont.uMap[flagName][2] = oldValue;
				cont.dirty = true;
			} else {
				render3d(screen, cont, objMat, s[3]);
			}
			return;
	}
}