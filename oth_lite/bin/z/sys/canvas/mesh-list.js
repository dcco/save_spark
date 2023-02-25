define(["require", "exports", "z/shader/buffer", "z/mat/mesh"], function (require, exports, buffer_1, mesh_1) {
    "use strict";
    exports.__esModule = true;
    exports.addMesh = exports.GMeshList = void 0;
    exports.GMeshList = {
        init: function (gl) {
            this.spareBuf = (0, buffer_1.makeTexBuffer)(gl, [], "spare mesh buffer");
        },
        spareBuf: null,
        data: {},
        loadSquareZ: function (gl, w, h, debugName) {
            var name = "sz_" + w + "_" + h;
            if (debugName === null)
                debugName = "square z " + w + "x" + h;
            if (this.data[name] === undefined) {
                var vs = (0, buffer_1.squareZVertices)([0, 0], [w, h], 0);
                var vBuf = (0, buffer_1.makeVertBuffer)(gl, vs, debugName);
                var nBuf = (0, buffer_1.makeNormBuffer)(gl, vs, debugName);
                var mesh = (0, mesh_1.makeMesh)(vBuf, nBuf);
                this.data[name] = mesh;
                return mesh;
            }
            return this.data[name];
        },
        loadTestBox: function (gl) {
            if (this.data["test_box"] === undefined) {
                var vs = (0, buffer_1.squareYVertices)([0, 0], [1, 1], 0);
                vs = vs.concat((0, buffer_1.squareZVertices)([0, 0], [1, 1], 1));
                vs = vs.concat((0, buffer_1.squareZVertices)([1, 0], [-1, 1], 0));
                vs = vs.concat((0, buffer_1.squareXVertices)([0, 0], [1, 1], 0));
                vs = vs.concat((0, buffer_1.squareXVertices)([1, 0], [-1, 1], 1));
                vs = vs.concat((0, buffer_1.squareYVertices)([1, 0], [-1, 1], 1));
                var vBuf = (0, buffer_1.makeVertBuffer)(gl, vs, "test box");
                var nBuf = (0, buffer_1.makeNormBuffer)(gl, vs, "test box");
                var mesh = (0, mesh_1.makeMesh)(vBuf, nBuf);
                this.data["test_box"] = mesh;
                return mesh;
            }
            return this.data["test_box"];
        },
        loadScreen: function (gl) {
            if (this.data["screen"] === undefined) {
                var vs = (0, buffer_1.squareZVertices)([-1, -1], [2, 2], 0);
                var vBuf = (0, buffer_1.makeVertBuffer)(gl, vs, "screen");
                var nBuf = (0, buffer_1.makeNormBuffer)(gl, vs, "screen");
                var mesh = (0, mesh_1.makeMesh)(vBuf, nBuf);
                this.data["screen"] = mesh;
                return mesh;
            }
            return this.data["screen"];
        },
        loadName: function (gl, name) {
            switch (name) {
                case 'test_box':
                    return this.loadTestBox(gl);
                case 'screen':
                    return this.loadScreen(gl);
                default:
                    if (this.data[name] !== undefined) {
                        return this.data[name];
                    }
                    return null;
            }
        }
    };
    function addMesh(gl, name, vs) {
        var vBuf = (0, buffer_1.makeVertBuffer)(gl, vs, name);
        var nBuf = (0, buffer_1.makeNormBuffer)(gl, vs, name);
        exports.GMeshList.data[name] = (0, mesh_1.makeMesh)(vBuf, nBuf);
    }
    exports.addMesh = addMesh;
});
