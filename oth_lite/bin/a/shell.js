var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "gl-matrix", "z/parse/fetch", "z/sys/input/input", "z/shader/buffer", "z/mat/texture", "z/mat/sprite", "z/sys/canvas/shader-wrap", "z/sys/canvas/image-list", "z/sys/canvas/sprite-list", "z/sys/canvas/mesh-list", "z/sys/audio/audio", "z/sys/audio/audio-list", "z/sys/cb/gbox", "z/sys/cb/text", "z/main/screen", "z/main/capture", "b/compile/compile", "b/compile/shader-comp", "b/compile/toc-comp", "a/base-shader"], function (require, exports, gl_matrix_1, fetch_1, input_1, buffer_1, texture_1, sprite_1, shader_wrap_1, image_list_1, sprite_list_1, mesh_list_1, audio_1, audio_list_1, gbox_1, text_1, screen_1, capture_1, compile_1, shader_comp_1, toc_comp_1, base_shader_1) {
    "use strict";
    exports.__esModule = true;
    exports.main = void 0;
    function loadSettings(arg) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, setData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = {
                            projName: arg,
                            toc: false,
                            width: 800,
                            height: 600,
                            zoom: 2,
                            pipeline: "none",
                            locale: "",
                            shaderLocale: ""
                        };
                        return [4 /*yield*/, (0, fetch_1.loadJsonFile)(arg, 'settings.json')];
                    case 1:
                        setData = _a.sent();
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
                            (0, sprite_1.setTileSize)(setData['tileSize']);
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
                        return [2 /*return*/, settings];
                }
            });
        });
    }
    function loadPipeline(screen, shaderLocale, pName) {
        return __awaiter(this, void 0, void 0, function () {
            var rfs, g, pipeBlock, pipeCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rfs = (0, shader_wrap_1.RenderFunStore)();
                        g = {
                            'mat4': gl_matrix_1.mat4,
                            'vec3': gl_matrix_1.vec3,
                            'gl': screen.gl,
                            'shaderLocale': shaderLocale,
                            'pName': pName,
                            'newShader': shader_comp_1.shaderComp,
                            'newFrameBuffer': shader_comp_1.frameBufferComp,
                            'fixedTexImageFloat': texture_1.fixedTexImageFloat,
                            'rfs': rfs
                        };
                        return [4 /*yield*/, (0, fetch_1.loadOthFile)(shaderLocale + "shader", pName, "pipe.oth")];
                    case 1:
                        pipeBlock = _a.sent();
                        pipeCode = (0, compile_1.compBody)(pipeBlock);
                        console.log('pipeline read success.');
                        //console.log(pipeCode);
                        eval("__globals = g; " + pipeCode + "\n __globals.rfs.iData = __iData();\n __globals.rfs.rFun = __render;");
                        return [4 /*yield*/, (0, shader_comp_1.shaderListInit)(screen.gl, shaderLocale)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, rfs];
                }
            });
        });
    }
    function loadMesh(screen, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var g, preBlock, preCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        g = {
                            'VBuf': {
                                'quadVertices': buffer_1.quadVertices,
                                'squareZVertices': buffer_1.squareZVertices,
                                'squareYVertices': buffer_1.squareYVertices,
                                'squareXVertices': buffer_1.squareXVertices
                            },
                            'buildMesh': function (name, vs) {
                                (0, mesh_list_1.addMesh)(screen.gl, name, vs);
                            }
                        };
                        return [4 /*yield*/, (0, fetch_1.loadOthFile)(settings.locale + "rom", settings.projName, "prelude.oth")];
                    case 1:
                        preBlock = _a.sent();
                        preCode = (0, compile_1.compBody)(preBlock);
                        console.log('prelude success.');
                        //console.log(preCode);
                        eval("__globals = g; __settings = settings; " + preCode);
                        return [2 /*return*/];
                }
            });
        });
    }
    function buildSprite(screen, sData, manualFlag) {
        console.log(sData);
        switch (sData[0]) {
            case 'TSET':
                (0, sprite_list_1.addTileset)(screen.gl, sData[1], sData[2], sData[3], sData[4]);
                return;
            case 'SPRITE':
                (0, sprite_list_1.addSprite)(screen.gl, sData[1], sData[2], sData[3], sData[4], sData[5], manualFlag, sData[6]);
                return;
            case 'XSHEET':
                (0, sprite_list_1.addXSheet)(screen.gl, sData[1], sData[2], sData[3], sData[4], sData[5]);
                return;
        }
    }
    function main(arg) {
        return __awaiter(this, void 0, void 0, function () {
            function drawLoop() {
                //		var drawList: Scene[] = [];
                //		drawList.push(GText.scene(0, 0, "HELLO WORLD."));
                //		var scene = SList(drawList);
                (0, base_shader_1.base2Draw)(screen, baseShader, g.curScene);
                capture.copy();
                if (rfs !== null) {
                    (0, screen_1.enableDepth)(screen.gl);
                    rCont.renderFlags = g.curRenderFlags;
                    rfs.rFun(rCont, g.curMvMat, g.curScene3d);
                }
                (0, screen_1.disableDepth)(screen.gl);
                (0, base_shader_1.base2Equip)(screen, baseShader);
                capture.draw(screen.baseProg);
                //eval()
                window.setTimeout(drawLoop, 1000 / 60);
            }
            var settings, canvas, screen, gl, baseShader, capture, specCanvas, imageList, _i, imageList_1, image, spriteList, manualFlag, _a, spriteList_1, sData, musicList, _b, musicList_1, music, mName, vol, pipeFlag, rfs, sn, g, iData, rCont, allCode, fileBlock, fileCode;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, loadSettings(arg)];
                    case 1:
                        settings = _c.sent();
                        canvas = document.getElementById('screen');
                        return [4 /*yield*/, (0, screen_1.XScreen)(canvas, settings)];
                    case 2:
                        screen = _c.sent();
                        gl = screen.gl;
                        baseShader = (0, base_shader_1.BaseShader)(settings);
                        capture = (0, capture_1.Capture)(gl, settings);
                        specCanvas = document.createElement('canvas');
                        image_list_1.GImageList.init(specCanvas, settings.projName);
                        audio_list_1.GAudioList.init(settings.locale, settings.projName);
                        input_1.GInput.init();
                        // initialize system resources
                        mesh_list_1.GMeshList.init(screen.gl);
                        gbox_1.GBox.init(screen.gl);
                        text_1.GText.init(canvas, screen.gl);
                        if (!(settings.res !== undefined && settings.res.imageList !== undefined)) return [3 /*break*/, 6];
                        imageList = settings.res.imageList;
                        _i = 0, imageList_1 = imageList;
                        _c.label = 3;
                    case 3:
                        if (!(_i < imageList_1.length)) return [3 /*break*/, 6];
                        image = imageList_1[_i];
                        return [4 /*yield*/, image_list_1.GImageList.load(screen.gl, image)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        // compile sprites
                        if (settings.res !== undefined && settings.res.spriteList !== undefined) {
                            spriteList = settings.res.spriteList;
                            manualFlag = false;
                            if (settings.res.manualOffset !== undefined) {
                                console.log("manual sprite offset loading.");
                                manualFlag = true;
                            }
                            for (_a = 0, spriteList_1 = spriteList; _a < spriteList_1.length; _a++) {
                                sData = spriteList_1[_a];
                                buildSprite(screen, sData, manualFlag);
                            }
                        }
                        // compile mesh
                        loadMesh(screen, settings);
                        if (!(settings.res !== undefined && settings.res.musicList !== undefined)) return [3 /*break*/, 10];
                        musicList = settings.res.musicList;
                        _b = 0, musicList_1 = musicList;
                        _c.label = 7;
                    case 7:
                        if (!(_b < musicList_1.length)) return [3 /*break*/, 10];
                        music = musicList_1[_b];
                        mName = music[0], vol = music[1];
                        return [4 /*yield*/, audio_list_1.GAudioList.load(mName, vol)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 7];
                    case 10:
                        pipeFlag = false;
                        rfs = null;
                        if (!(settings.pipeline !== "none")) return [3 /*break*/, 12];
                        pipeFlag = true;
                        return [4 /*yield*/, loadPipeline(screen, settings.shaderLocale, settings.pipeline)];
                    case 11:
                        rfs = _c.sent();
                        _c.label = 12;
                    case 12:
                        sn = ["nop"];
                        g = {
                            mat4: gl_matrix_1.mat4, vec3: gl_matrix_1.vec3,
                            GImageList: image_list_1.GImageList,
                            GAudio: audio_1.GAudio, GInput: input_1.GInput,
                            curScene: sn, curScene3d: sn, curMvMat: gl_matrix_1.mat4.create(),
                            curRenderFlags: {}
                        };
                        iData = {};
                        if (rfs !== null) {
                            iData = rfs.iData;
                        }
                        rCont = (0, shader_wrap_1.RenderCont)(iData, screen);
                        drawLoop();
                        console.log('draw loop initiate.');
                        if (!settings.toc) return [3 /*break*/, 14];
                        return [4 /*yield*/, (0, toc_comp_1.compToc)(settings)];
                    case 13:
                        allCode = _c.sent();
                        console.log('project load success.');
                        eval("__globals = g; " + allCode + "\n __main();");
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, (0, fetch_1.loadOthFile)(settings.locale + "rom", settings.projName, 'src/main.oth')];
                    case 15:
                        fileBlock = _c.sent();
                        fileCode = (0, compile_1.compBody)(fileBlock);
                        //console.log(fileCode);
                        console.log('project load success.');
                        eval("__globals = g; " + fileCode + "\n __main();");
                        _c.label = 16;
                    case 16: return [2 /*return*/];
                }
            });
        });
    }
    exports.main = main;
});
