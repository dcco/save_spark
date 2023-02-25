define(["require", "exports", "z/shader/buffer", "z/mat/texture", "z/mat/sprite", "z/mat/mesh"], function (require, exports, buffer_1, texture_1, sprite_1, mesh_1) {
    "use strict";
    exports.__esModule = true;
    exports.GBox = void 0;
    exports.GBox = {
        data: null,
        init: function (gl) {
            var vertices = (0, buffer_1.squareZVertices)([0, 0], [1, 1], 0);
            var vBuf = (0, buffer_1.makeVertBuffer)(gl, vertices, "default texture");
            var sprite = (0, sprite_1.makeDefSprite)(gl, (0, texture_1.defTexImage)(gl));
            var mesh = (0, mesh_1.make2DMesh)(gl, vBuf);
            this.data = {
                'sprite': sprite,
                'mesh': mesh
            };
        },
        setVBuf: function (gl, x, y, w, h) {
            if (this.data === null)
                return;
            var vBuf = this.data.mesh.vBuf;
            var vertices = (0, buffer_1.squareZVertices)([x, y], [w, h], 0);
            (0, buffer_1.updateVertBuffer)(gl, vBuf, vertices, gl.DYNAMIC_DRAW);
        }
    };
});
