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
define(["require", "exports", "z/shader/shader"], function (require, exports, shader_1) {
    "use strict";
    exports.__esModule = true;
    exports.switchDrawBuffers = exports.useBufferTexture = exports.clearFrameBuffer = exports.useFrameBuffer = exports.FrameBuffer = exports.texNum = void 0;
    function attachNum(gl, i) {
        switch (i) {
            case 1: return gl.COLOR_ATTACHMENT1;
            case 2: return gl.COLOR_ATTACHMENT2;
            case 3: return gl.COLOR_ATTACHMENT3;
            case 4: return gl.COLOR_ATTACHMENT4;
            case 5: return gl.COLOR_ATTACHMENT5;
            case 6: return gl.COLOR_ATTACHMENT6;
            case 7: return gl.COLOR_ATTACHMENT7;
            case 8: return gl.COLOR_ATTACHMENT8;
            case 9: return gl.COLOR_ATTACHMENT9;
            default:
                return gl.COLOR_ATTACHMENT0;
        }
    }
    function texNum(gl, i) {
        switch (i) {
            case 1: return gl.TEXTURE1;
            case 2: return gl.TEXTURE2;
            case 3: return gl.TEXTURE3;
            case 4: return gl.TEXTURE4;
            case 5: return gl.TEXTURE5;
            case 6: return gl.TEXTURE6;
            case 7: return gl.TEXTURE7;
            case 8: return gl.TEXTURE8;
            case 9: return gl.TEXTURE9;
            default:
                return gl.TEXTURE0;
        }
    }
    exports.texNum = texNum;
    function dummyData(w, h) {
        var z = [];
        for (var i = 0; i < w * h; i++) {
            z.push(0);
            z.push(0);
            z.push(0);
            z.push(0);
        }
        return z;
    }
    function makeColorBuffer(gl, name, w, h, i) {
        var colorId = gl.createTexture();
        if (colorId === null)
            throw ("frame-buffer.js - Failed to initialize color buffer texture.");
        gl.bindTexture(gl.TEXTURE_2D, colorId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        if (i !== null)
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachNum(gl, i), gl.TEXTURE_2D, colorId, 0);
        return colorId;
    }
    function makeDepthBuffer(gl, name, w, h) {
        var depthId = gl.createTexture();
        if (depthId === null)
            throw ("frame-buffer.js - Failed to initialize depth buffer texture.");
        gl.bindTexture(gl.TEXTURE_2D, depthId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, w, h, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthId, 0);
        //gl.drawBuffers([gl.NONE]);
        //gl.readBuffer(gl.NONE);
        return depthId;
    }
    function FrameBuffer(gl, locale, sName, name, width, height, bufferList) {
        return __awaiter(this, void 0, void 0, function () {
            var shader, fbo, bufferMap, renderFlag, colorTotal, i, bufferType, bufId, bufId, bufId, colorArray, i, rbo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, shader_1.Shader)(gl, locale, sName, name)];
                    case 1:
                        shader = _a.sent();
                        // re-use to ensure no async interleaving
                        gl.useProgram(shader.prog);
                        fbo = gl.createFramebuffer();
                        if (fbo === null)
                            throw ("frame-buffer.js - Failed to initialize frame buffer object.");
                        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
                        bufferMap = {};
                        renderFlag = false;
                        colorTotal = 0;
                        for (i = 0; i < bufferList.length; i++) {
                            bufferType = bufferList[i];
                            switch (bufferType[0]) {
                                case 'color':
                                    bufId = makeColorBuffer(gl, bufferType[1], width, height, colorTotal);
                                    bufferMap[bufferType[1]] = bufId;
                                    colorTotal = colorTotal + 1;
                                    break;
                                case 'alt-color':
                                    bufId = makeColorBuffer(gl, bufferType[1], width, height, null);
                                    bufferMap[bufferType[1]] = bufId;
                                    break;
                                case 'depth':
                                    bufId = makeDepthBuffer(gl, bufferType[1], width, height);
                                    bufferMap[bufferType[1]] = bufId;
                                    break;
                                case 'render':
                                    renderFlag = true;
                            }
                        }
                        // attach color buffers
                        if (colorTotal > 0) {
                            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fbo);
                            colorArray = [];
                            for (i = 0; i < colorTotal; i++) {
                                colorArray.push(attachNum(gl, i));
                            }
                            gl.drawBuffers(colorArray);
                        }
                        rbo = null;
                        if (renderFlag) {
                            rbo = gl.createRenderbuffer();
                            if (rbo === null)
                                throw ("frame-buffer.js - Failed to initialize render buffer.");
                            gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
                            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
                            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rbo);
                        }
                        // final check + return
                        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
                            console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER));
                            throw ("Loading `" + name + "` frame buffer incomplete.");
                        }
                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                        return [2 /*return*/, {
                                'shader': shader,
                                'width': width,
                                'height': height,
                                'fbo': fbo,
                                'rbo': rbo,
                                'bufMap': bufferMap
                            }];
                }
            });
        });
    }
    exports.FrameBuffer = FrameBuffer;
    function useFrameBuffer(gl, buf) {
        (0, shader_1.useShader)(gl, buf.shader);
        gl.bindFramebuffer(gl.FRAMEBUFFER, buf.fbo);
    }
    exports.useFrameBuffer = useFrameBuffer;
    function clearFrameBuffer(gl, buf) {
        gl.viewport(0, 0, buf.width, buf.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    exports.clearFrameBuffer = clearFrameBuffer;
    function useBufferTexture(gl, buf, name, slotId) {
        gl.activeTexture(texNum(gl, slotId));
        gl.bindTexture(gl.TEXTURE_2D, buf.bufMap[name]);
    }
    exports.useBufferTexture = useBufferTexture;
    function switchDrawBuffers(gl, buf, nameList) {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, buf.fbo);
        var colorArray = [];
        for (var i = 0; i < nameList.length; i++) {
            var colorId = buf.bufMap[nameList[i]];
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachNum(gl, i), gl.TEXTURE_2D, colorId, 0);
            colorArray.push(attachNum(gl, i));
        }
        gl.drawBuffers(colorArray);
    }
    exports.switchDrawBuffers = switchDrawBuffers;
});
