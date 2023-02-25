
import { mat4, vec3 } from "gl-matrix"

import { loadJsonFile, loadOthFile } from "z/parse/fetch"
import { GInput } from "z/sys/input/input"

import { quadVertices, squareZVertices, squareYVertices, squareXVertices } from "z/shader/buffer"
import { fixedTexImageFloat } from "z/mat/texture"
import { setTileSize } from "z/mat/sprite"

import { Scene } from "z/sys/canvas/scene"
import { Scene3d } from "z/sys/canvas/scene3d"
import { RenderCont, RenderFunStore } from "z/sys/canvas/shader-wrap"
import { GImageList } from "z/sys/canvas/image-list"
import { addSprite, addXSheet, addTileset } from "z/sys/canvas/sprite-list"
import { GMeshList, addMesh } from "z/sys/canvas/mesh-list"
import { GAudio } from "z/sys/audio/audio"
import { GAudioList } from "z/sys/audio/audio-list"
import { GBox } from "z/sys/cb/gbox"
import { GText } from "z/sys/cb/text"

import { Settings, XScreen, enableDepth, disableDepth } from "z/main/screen"
import { Capture } from "z/main/capture"

import { compBody } from "b/compile/compile"
import { shaderComp, frameBufferComp, shaderListInit } from "b/compile/shader-comp"
import { compToc } from "b/compile/toc-comp"
import { BaseShader, base2Draw, base2Equip } from "a/base-shader"

async function loadSettings(arg: string): Promise<Settings>
{
	var settings: Settings = {
		projName: arg,
		toc: false,
		width: 800,
		height: 600,
		zoom: 2,
		pipeline: "none",
		locale: "",
		shaderLocale: ""
	};
	
	var setData = await loadJsonFile(arg, 'settings.json');
	if ('toc' in setData) {
		settings.toc = setData['toc'];
	}
	if ('width' in setData) {
		settings.width = setData['width'];
	}
	if ('height' in setData) {
		settings.height = setData['height'];
	}
	if ('zoom2d' in setData) {
		settings.zoom = setData['zoom2d'];
	}
	if ('tileSize' in setData) {
		setTileSize(setData['tileSize']);
	}
	if ('pipeline' in setData) {
		settings.pipeline = setData['pipeline'];
	}
	if ('res' in setData) {
		settings.res = setData['res'];
	}
	if ('locale' in setData) {
		settings.locale = setData['locale'];
	}
	if ('shaderLocale' in setData) {
		settings.shaderLocale = setData['shaderLocale'];
	}

	return settings;
}

async function loadPipeline(screen: XScreen, shaderLocale: string, pName: string): Promise<RenderFunStore>
{
	// prepare shader context
	var rfs = RenderFunStore();
	var g = {
		'mat4': mat4,
		'vec3': vec3,
		'gl': screen.gl,
		'shaderLocale': shaderLocale,
		'pName': pName,
		'newShader': shaderComp,
		'newFrameBuffer': frameBufferComp,
		'fixedTexImageFloat': fixedTexImageFloat,
		'rfs': rfs
	};

	// run pipeline compiler
	var pipeBlock = await loadOthFile(shaderLocale + "shader", pName, "pipe.oth");
	var pipeCode = compBody(pipeBlock);
	console.log('pipeline read success.');
	//console.log(pipeCode);
	eval("__globals = g; " + pipeCode + "\n __globals.rfs.iData = __iData();\n __globals.rfs.rFun = __render;");
	await shaderListInit(screen.gl, shaderLocale);
	return rfs;
}

async function loadMesh(screen: XScreen, settings: Settings)
{
	var g = {
		'VBuf': {
    		'quadVertices': quadVertices,
    		'squareZVertices': squareZVertices,
    		'squareYVertices': squareYVertices,
    		'squareXVertices': squareXVertices	
    	},
		'buildMesh': function (name, vs) {
			addMesh(screen.gl, name, vs);
		}
	};

	var preBlock = await loadOthFile(settings.locale + "rom", settings.projName, "prelude.oth");
	var preCode = compBody(preBlock);
	console.log('prelude success.');
	//console.log(preCode);
	eval("__globals = g; __settings = settings; " + preCode);
}

function buildSprite(screen: XScreen, sData: any[], manualFlag: boolean) {
	console.log(sData);
	switch (sData[0]) {
		case 'TSET':
			addTileset(screen.gl, sData[1], sData[2], sData[3], sData[4]);
			return;
		case 'SPRITE':
			addSprite(screen.gl, sData[1], sData[2], sData[3], sData[4], sData[5], manualFlag, sData[6]);
			return;
		case 'XSHEET':
			addXSheet(screen.gl, sData[1], sData[2], sData[3], sData[4], sData[5]);
			return;
	}
}

export async function main(arg: string)
{
	// load settings
	var settings = await loadSettings(arg);

	// initialize gl + canvas
	var canvas = <HTMLCanvasElement> document.getElementById('screen');
	var screen = await XScreen(canvas, settings);
	var gl = screen.gl;

	// initialize 2d shader + capture card
	var baseShader = BaseShader(settings);
	var capture = Capture(gl, settings);

	// initialize system components
	var specCanvas = document.createElement('canvas');
	GImageList.init(specCanvas, settings.projName);
	GAudioList.init(settings.locale, settings.projName);
	GInput.init();

	// initialize system resources
	GMeshList.init(screen.gl);
	GBox.init(screen.gl);
	GText.init(canvas, screen.gl);
	
	// load image resources
	if (settings.res !== undefined && settings.res.imageList !== undefined) {
		var imageList = settings.res.imageList;
		for (let image of imageList) {
			await GImageList.load(screen.gl, image);
		}	
	}

	// compile sprites
	if (settings.res !== undefined && settings.res.spriteList !== undefined) {
		var spriteList = settings.res.spriteList;
		var manualFlag = false;
		if (settings.res.manualOffset !== undefined) {
			console.log("manual sprite offset loading.");
			manualFlag = true;
		}
		for (let sData of spriteList) {
			buildSprite(screen, sData, manualFlag);
		}
	}

	// compile mesh
	loadMesh(screen, settings);

	// load audio resources
	if (settings.res !== undefined && settings.res.musicList !== undefined) {
		var musicList = settings.res.musicList;
		for (let music of musicList) {
			var [mName, vol] = music;
			await GAudioList.load(mName, vol);
		}	
	}
	
	// load pipeline shader
	var pipeFlag = false;
	var rfs: RenderFunStore | null = null;
	if (settings.pipeline !== "none") {
		pipeFlag = true;
		rfs = await loadPipeline(screen, settings.shaderLocale, settings.pipeline);
	}

	// define global data for bootstrap
	var sn: Scene = ["nop"]; 
	var g = {
		mat4: mat4, vec3: vec3,
		GImageList: GImageList, 
		GAudio: GAudio, GInput: GInput,
		curScene: sn, curScene3d: sn, curMvMat: mat4.create(),
		curRenderFlags: {},
	};

	// begin background render loop
	var iData = {};
	if (rfs !== null) { iData = rfs.iData; }
	var rCont = RenderCont(iData, screen);
	function drawLoop() {
//		var drawList: Scene[] = [];
//		drawList.push(GText.scene(0, 0, "HELLO WORLD."));
//		var scene = SList(drawList);
		base2Draw(screen, baseShader, g.curScene);
		capture.copy();

		if (rfs !== null) {
			enableDepth(screen.gl);
			rCont.renderFlags = g.curRenderFlags;
			rfs.rFun(rCont, g.curMvMat, g.curScene3d);
		}

		disableDepth(screen.gl);
		base2Equip(screen, baseShader);
		capture.draw(screen.baseProg);

		//eval()
		window.setTimeout(drawLoop, 1000 / 60);
	}
	drawLoop();
	console.log('draw loop initiate.');

	// load game files
	if (settings.toc) {
		var allCode = await compToc(settings);
		console.log('project load success.');
		eval("__globals = g; " + allCode + "\n __main();");
	} else {
		var fileBlock = await loadOthFile(settings.locale + "rom", settings.projName, 'src/main.oth');
		var fileCode = compBody(fileBlock);
		//console.log(fileCode);
		console.log('project load success.');
		eval("__globals = g; " + fileCode + "\n __main();");
	}

	// load game files
	/*var file = await fetch("rom/" + PROJ_NAME + "/src/main.tiny");
	var fileText = await file.text();
	var lexer = newLexer();
	lexer.setInput(fileText);

	var tokenList: VToken[] = [];
    var curToken = lexer.nextToken();
    while (!lexer.isEOF(curToken)) {
        tokenList.push(curToken);
        curToken = lexer.nextToken();
    }

    var cont = { 'shader': screen.baseProg };
    var _globals = {
    	'render': function (s) {
    		base2Draw(screen, cont, pMat, s);
    	},
    	'mat4': mat4, 'vec3': vec3,
    	'GInput': GInput,
    	'SImage': SImage, 'SList': SList, 'SNop': SNop,
    	'SBox': SBox, 'SOffset': SOffset, 'SScale': SScale,
    	'GImageList': GImageList
    }

    var blockData = parseBlock(tokenList);
    eval("__globals = _globals;\n");
    var blockCode = await directBlock(screen.gl, blockData);
    console.log(blockCode);
    eval(blockCode + "\n__main();");*/
}
