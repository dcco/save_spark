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
define(["require", "exports", "z/parse/fetch", "b/compile/compile"], function (require, exports, fetch_1, compile_1) {
    "use strict";
    exports.__esModule = true;
    exports.compToc = void 0;
    function loadModule(settings, lName, modData) {
        return __awaiter(this, void 0, void 0, function () {
            var mName, fileList, modCode, _i, fileList_1, f, fileBlock, fileCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mName = modData.name;
                        fileList = modData.fileList;
                        modCode = "";
                        if (modData.debug === true) {
                            console.log("compiling module " + lName + "." + mName);
                        }
                        _i = 0, fileList_1 = fileList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < fileList_1.length)) return [3 /*break*/, 4];
                        f = fileList_1[_i];
                        if (modData.debug === true) {
                            console.log("> compiling: " + f + ".oth");
                        }
                        return [4 /*yield*/, (0, fetch_1.loadOthFile)(settings.locale + "rom", settings.projName + "/src/" + lName + "/" + mName, f + '.oth')];
                    case 2:
                        fileBlock = _a.sent();
                        fileCode = (0, compile_1.compBody)(fileBlock);
                        modCode = modCode + fileCode + "\n\n";
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (modData.debug === true) {
                            console.log(modCode);
                        }
                        return [2 /*return*/, modCode];
                }
            });
        });
    }
    function loadLibrary(settings, libData) {
        return __awaiter(this, void 0, void 0, function () {
            var lName, modList, libCode, _i, modList_1, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        lName = libData.name;
                        modList = libData.modList;
                        libCode = "";
                        _i = 0, modList_1 = modList;
                        _b.label = 1;
                    case 1:
                        if (!(_i < modList_1.length)) return [3 /*break*/, 4];
                        m = modList_1[_i];
                        _a = libCode;
                        return [4 /*yield*/, loadModule(settings, lName, m)];
                    case 2:
                        libCode = _a + (_b.sent()) + "\n\n\n";
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, libCode];
                }
            });
        });
    }
    function compToc(settings) {
        return __awaiter(this, void 0, void 0, function () {
            var tocData, allCode, _i, tocData_1, l, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.loadJsonFile)(settings.projName, 'toc.json')];
                    case 1:
                        tocData = _b.sent();
                        allCode = "";
                        _i = 0, tocData_1 = tocData;
                        _b.label = 2;
                    case 2:
                        if (!(_i < tocData_1.length)) return [3 /*break*/, 5];
                        l = tocData_1[_i];
                        _a = allCode;
                        return [4 /*yield*/, loadLibrary(settings, l)];
                    case 3:
                        allCode = _a + (_b.sent());
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, allCode];
                }
            });
        });
    }
    exports.compToc = compToc;
});
