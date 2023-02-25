
import { GL } from "z/shader/shader"
import { TexImage, buildTexImage } from "z/mat/texture"

type ImageListIface = {
	canvasCont: CanvasRenderingContext2D | null,
	projName: string,
	data: { [name: string]: TexImage },
	init: (canvas: HTMLCanvasElement, name: string) => void,
	load: (gl: GL, name: string) => void,
	contains: (name: string) => boolean,
	get: (name: string) => TexImage
}

export async function loadImage(gl: GL, url: string): Promise<HTMLImageElement> {
	return new Promise((resolve) => {
		var image = new Image();
		image.onload = () => resolve(image);
		image.src = url;
	});
}

export const GImageList: ImageListIface = {
	canvasCont: null,
	projName: "game",
	data: {},
	init: function(canvas, projName) {
		this.canvasCont = canvas.getContext('2d');
		this.projName = projName;
	},
	load: async function(gl, name) {
		var src = await loadImage(gl, "rom/" + this.projName + "/img/" + name + ".png");
		if (this.canvasCont !== null) this.canvasCont.drawImage(src, 0, 0);
		else throw ('Attempted to load image `' + name + '` with unitialized canvas context.');
		var texImage = buildTexImage(gl, src, this.canvasCont.getImageData(0, 0, src.width, src.height));
		this.data[name] = texImage;
	},
	contains: function(name) {
		return this.data[name] !== undefined;
	},
	get: function(name) {
		return this.data[name];
	}
}