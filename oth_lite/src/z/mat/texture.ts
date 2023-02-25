
import { mat4 } from "gl-matrix"

import { GL } from "z/shader/shader"

// type synonyms
export type TexId = WebGLTexture

// texture datatypes
export type TexSrc = {
	rawImage: HTMLImageElement,
	imageData: ImageData
}

export type TexImage = {
	src: TexSrc | null,
	name: string,
	width: number,
	height: number,
	texId: TexId
}

export function fixedTexImage(gl: GL, size: [number, number], rawData: Uint8Array): TexImage {
	// initialize texture data
	const texId = gl.createTexture();
	if (texId === null) throw("texture.js - Failed to create texture surface for fixed image.");

	var [w, h] = size;
	gl.bindTexture(gl.TEXTURE_2D, texId);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, rawData
	);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	// initialize texture buffer and return data
	//var tBuf = makeTexBuffer(gl, squareTexCoords(), "default image");
	return {
		src: null,
		name: "fixed image",
		width: w,
		height: h,
		texId: texId
	};
}

export function fixedTexImageFloat(gl: GL, size: [number, number], rawData: Float32Array): TexImage {
	// initialize texture data
	const texId = gl.createTexture();
	if (texId === null) throw("texture.js - Failed to create texture surface for fixed (float) image.");

	var [w, h] = size;
	gl.bindTexture(gl.TEXTURE_2D, texId);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0,
		gl.RGBA, gl.FLOAT, rawData
	);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	// initialize texture buffer and return data
	//var tBuf = makeTexBuffer(gl, squareTexCoords(), "default image");
	return {
		src: null,
		name: "float image",
		width: w,
		height: h,
		texId: texId
	};
}

export function defTexImage(gl: GL): TexImage {
	return fixedTexImage(gl, [2, 2],
		new Uint8Array([
			255, 255, 255, 255, 255, 255, 255, 255,
			255, 255, 255, 255, 255, 255, 255, 255
		]));
}

export function buildTexImage(gl: GL, image: HTMLImageElement, data: ImageData): TexImage {
	// initialize texture data
	const texId = gl.createTexture();
	if (texId === null) throw("texture.js - Failed to create texture surface for `" + image.src + "`.");

	gl.bindTexture(gl.TEXTURE_2D, texId);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA,
		gl.RGBA, gl.UNSIGNED_BYTE, image
	);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	// initialize texture buffer and return data
	//var tBuf = makeTexBuffer(gl, squareTexCoords(), "`" + image.src + "`");
	return {
		src: {
			rawImage: image,
			imageData: data
		},
		name: image.src,
		width: image.width,
		height: image.height,
		texId: texId
		//tBuf: tBuf
	};
}