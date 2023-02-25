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
define(["require", "exports", "z/shader/shader", "z/shader/frame-buffer"], function (require, exports, shader_1, frame_buffer_1) {
    "use strict";
    exports.__esModule = true;
    exports.shaderListInit = exports.frameBufferComp = exports.shaderComp = void 0;
    var shaderList = [];
    function completeShader(gl, prog, settings) {
        // add attributes
        var attrList = settings.attrList;
        if (attrList.pos !== undefined)
            (0, shader_1.addAttrib)(gl, prog, attrList.pos, 'aPos');
        if (attrList.tex !== undefined)
            (0, shader_1.addAttrib)(gl, prog, attrList.tex, 'aTex');
        if (attrList.norm !== undefined)
            (0, shader_1.addAttrib)(gl, prog, attrList.norm, 'aNorm');
        // add uniforms
        var unifList = settings.uniformList;
        if (unifList.objMat !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.objMat, 'uObj');
        if (unifList.modelMat !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.modelMat, 'uModel');
        if (unifList.persMat !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.persMat, 'uPers');
        if (unifList.sampler !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.sampler, 'uSampler');
        if (unifList.spriteFlag !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.spriteFlag, 'uSprite');
        if (unifList.color !== undefined)
            (0, shader_1.addUniform)(gl, prog, unifList.color, 'uColor');
        if (unifList.extra !== undefined) {
            for (var _i = 0, _a = unifList.extra; _i < _a.length; _i++) {
                var uName = _a[_i];
                (0, shader_1.addUniform)(gl, prog, uName);
            }
        }
        if (unifList.flagList !== undefined) {
            for (var _b = 0, _c = unifList.flagList; _b < _c.length; _b++) {
                var uName = _c[_b];
                (0, shader_1.addUniform)(gl, prog, uName);
            }
        }
        // add uniform textures
        var uTexList = settings.uTexList;
        if (uTexList !== undefined) {
            var i = 0;
            for (var _d = 0, uTexList_1 = uTexList; _d < uTexList_1.length; _d++) {
                var uTex = uTexList_1[_d];
                (0, shader_1.addUniformTex)(gl, prog, uTex, i);
                i = i + 1;
            }
        }
    }
    function shaderCompInit(container, gl, locale, pName, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var name, prog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = settings.name;
                        return [4 /*yield*/, (0, shader_1.Shader)(gl, locale, pName, name)];
                    case 1:
                        prog = _a.sent();
                        completeShader(gl, prog, settings);
                        container.prog = prog;
                        return [2 /*return*/];
                }
            });
        });
    }
    function shaderComp(gl, locale, pName, settings) {
        var container = { 'prog': null };
        console.log(settings.name);
        shaderList.push({ 'req': 'shader', 'container': container, 'pName': pName, 'settings': settings });
        //shaderCompInit(container, gl, locale, pName, settings);
        return container;
    }
    exports.shaderComp = shaderComp;
    function buildBufList(backingList) {
        var bufList = [];
        for (var _i = 0, backingList_1 = backingList; _i < backingList_1.length; _i++) {
            var backer = backingList_1[_i];
            switch (backer[0]) {
                case "depth":
                case "color":
                    bufList.push([backer[0], backer[1]]);
                    break;
                case "render":
                    bufList.push([backer[0], ""]);
                    break;
                case "altColor":
                    bufList.push(["alt-color", backer[1]]);
                    break;
            }
        }
        return bufList;
    }
    function fboCompInit(container, gl, locale, pName, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var name, size, bufferList, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = settings.name;
                        size = settings.size;
                        bufferList = buildBufList(settings.backingList);
                        return [4 /*yield*/, (0, frame_buffer_1.FrameBuffer)(gl, locale, pName, name, size[1], size[2], bufferList)];
                    case 1:
                        buffer = _a.sent();
                        completeShader(gl, buffer.shader, settings);
                        container.buf = buffer;
                        return [2 /*return*/];
                }
            });
        });
    }
    function frameBufferComp(gl, locale, pName, settings) {
        var container = { 'buf': null };
        console.log(settings.name);
        shaderList.push({ 'req': 'fbo', 'container': container, 'pName': pName, 'settings': settings });
        //fboCompInit(container, gl, locale, pName, settings);
        return container;
    }
    exports.frameBufferComp = frameBufferComp;
    function shaderListInit(gl, locale) {
        return __awaiter(this, void 0, void 0, function () {
            var i, shaderReq;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < shaderList.length)) return [3 /*break*/, 7];
                        shaderReq = shaderList[i];
                        console.log('init shader: ' + shaderReq.settings.name);
                        if (!(shaderReq.req === 'shader')) return [3 /*break*/, 3];
                        return [4 /*yield*/, shaderCompInit(shaderReq.container, gl, locale, shaderReq.pName, shaderReq.settings)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, fboCompInit(shaderReq.container, gl, locale, shaderReq.pName, shaderReq.settings)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        console.log('complete shader: ' + shaderReq.settings.name);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    exports.shaderListInit = shaderListInit;
});
