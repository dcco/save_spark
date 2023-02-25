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
define(["require", "exports", "z/shader/base2", "z/parse/fetch"], function (require, exports, base2_1, fetch_1) {
    "use strict";
    exports.__esModule = true;
    exports.setUniform3fv = exports.setUniform4f = exports.setUniform3f = exports.setUniform1f = exports.setUniformMat = exports.setAttribVec = exports.addUniformTex = exports.addUniform = exports.addAttrib = exports.clearShaderS = exports.clearShader = exports.useShader = exports.Shader = exports.getShader = void 0;
    function loadShaderSrc(locale, sName, name) {
        return __awaiter(this, void 0, void 0, function () {
            var fName, vName, fText, vText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fName = '/' + locale + 'shader/' + sName + "/" + name + '.fs';
                        vName = '/' + locale + 'shader/' + sName + "/" + name + '.vs';
                        if (fetch_1.IGNORE_DIR) {
                            fName = 'shader/' + sName + "/" + name + '.fs';
                            vName = 'shader/' + sName + "/" + name + '.vs';
                        }
                        return [4 /*yield*/, fetch(fName).then(function (response) { return response.text(); })];
                    case 1:
                        fText = _a.sent();
                        return [4 /*yield*/, fetch(vName).then(function (response) { return response.text(); })];
                    case 2:
                        vText = _a.sent();
                        return [2 /*return*/, [fText, vText]];
                }
            });
        });
    }
    function getShader(gl, str, sType) {
        // compile shader
        var shader = gl.createShader(sType);
        if (shader === null)
            throw ("shader.js - Failed to initialize shader.");
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        // check whether shader compiled
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Failed to compile shader.");
            throw ("shader.js - " + gl.getShaderInfoLog(shader));
        }
        return shader;
    }
    exports.getShader = getShader;
    function Shader(gl, locale, sName, name) {
        return __awaiter(this, void 0, void 0, function () {
            var shaderSrc, fText, vText, fragShader, vertexShader, shaderProg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shaderSrc = [base2_1.BASE2_F_SHADER, base2_1.BASE2_V_SHADER];
                        if (!(name !== 'base2')) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadShaderSrc(locale, sName, name)];
                    case 1:
                        shaderSrc = _a.sent();
                        _a.label = 2;
                    case 2:
                        fText = shaderSrc[0], vText = shaderSrc[1];
                        fragShader = getShader(gl, fText, gl.FRAGMENT_SHADER);
                        vertexShader = getShader(gl, vText, gl.VERTEX_SHADER);
                        shaderProg = gl.createProgram();
                        if (shaderProg === null)
                            throw ("shader.js - Could not create shader program!");
                        gl.attachShader(shaderProg, vertexShader);
                        gl.attachShader(shaderProg, fragShader);
                        gl.linkProgram(shaderProg);
                        if (!gl.getProgramParameter(shaderProg, gl.LINK_STATUS)) {
                            throw ("shader.js - Could not initialize shaders.");
                        }
                        gl.useProgram(shaderProg);
                        return [2 /*return*/, {
                                'name': name,
                                'prog': shaderProg,
                                'aPos': null, 'aTex': null, 'aNorm': null,
                                'uPers': null, 'uModel': null, 'uObj': null,
                                'uSampler': null, 'uColor': null, 'uSprite': null,
                                'aList': {}, 'uList': {}
                            }];
                }
            });
        });
    }
    exports.Shader = Shader;
    function useShader(gl, shader) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(shader.prog);
    }
    exports.useShader = useShader;
    function clearShader(screen) {
        var gl = screen.gl;
        gl.viewport(0, 0, screen.viewportWidth, screen.viewportHeight);
        gl.clearColor(0.45, 0.45, 0.55, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    exports.clearShader = clearShader;
    function clearShaderS(screen) {
        var gl = screen.gl;
        gl.viewport(0, 0, screen.viewportWidth, screen.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    exports.clearShaderS = clearShaderS;
    function addAttrib(gl, shader, name, spec) {
        if (spec !== undefined)
            shader[spec] = name;
        var aLoc = gl.getAttribLocation(shader.prog, name);
        if (aLoc === null)
            throw ("shader.js - Could not get shader attribute location `" + name + "`.");
        gl.enableVertexAttribArray(aLoc);
        shader.aList[name] = aLoc;
        return shader;
    }
    exports.addAttrib = addAttrib;
    function addUniform(gl, shader, name, spec) {
        if (spec !== undefined)
            shader[spec] = name;
        var uLoc = gl.getUniformLocation(shader.prog, name);
        if (uLoc === null)
            throw ("shader.js - Could not get shader uniform location `" + name + "`.");
        shader.uList[name] = uLoc;
        return shader;
    }
    exports.addUniform = addUniform;
    function addUniformTex(gl, shader, name, i) {
        var uLoc = gl.getUniformLocation(shader.prog, name);
        gl.uniform1i(uLoc, i);
        return shader;
    }
    exports.addUniformTex = addUniformTex;
    function setAttribVec(gl, shader, name, buf, size) {
        if (name === null)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.vertexAttribPointer(shader.aList[name], size, gl.FLOAT, false, 0, 0);
    }
    exports.setAttribVec = setAttribVec;
    function setUniformMat(gl, shader, name, mat) {
        if (name === null)
            return;
        gl.uniformMatrix4fv(shader.uList[name], false, mat);
    }
    exports.setUniformMat = setUniformMat;
    function setUniform1f(gl, shader, name, c) {
        if (name === null)
            return;
        gl.uniform1f(shader.uList[name], c);
    }
    exports.setUniform1f = setUniform1f;
    function setUniform3f(gl, shader, name, c) {
        if (name === null)
            return;
        gl.uniform3f(shader.uList[name], c[0], c[1], c[2]);
    }
    exports.setUniform3f = setUniform3f;
    function setUniform4f(gl, shader, name, c) {
        if (name === null)
            return;
        gl.uniform4f(shader.uList[name], c[0], c[1], c[2], c[3]);
    }
    exports.setUniform4f = setUniform4f;
    function setUniform3fv(gl, shader, name, fv, i) {
        var sampleLoc = gl.getUniformLocation(shader.prog, name + '[' + i + ']');
        gl.uniform3fv(sampleLoc, fv);
    }
    exports.setUniform3fv = setUniform3fv;
});
