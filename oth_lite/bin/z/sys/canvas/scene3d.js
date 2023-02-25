define(["require", "exports", "gl-matrix", "z/shader/shader", "z/mat/sprite", "z/mat/mesh", "z/sys/canvas/image-list", "z/sys/canvas/sprite-list", "z/sys/canvas/mesh-list"], function (require, exports, gl_matrix_1, shader_1, sprite_1, mesh_1, image_list_1, sprite_list_1, mesh_list_1) {
    "use strict";
    exports.__esModule = true;
    exports.render3d = exports.procUniformArgs = void 0;
    var OFF_MAT = gl_matrix_1.mat4.create();
    function procUniformArgs(screen, cont) {
        var uArgs = cont.uArgs;
        if (cont.dirty === false || uArgs.length === 0)
            return;
        var prog = cont.shader;
        var uMap = cont.uMap;
        for (var _i = 0, uArgs_1 = uArgs; _i < uArgs_1.length; _i++) {
            var uArg = uArgs_1[_i];
            var uValue = uMap[uArg[0]][2];
            switch (uArg[1]) {
                case 'mat':
                    (0, shader_1.setUniformMat)(screen.gl, prog, uArg[0], uValue);
                    break;
                case '1f':
                    (0, shader_1.setUniform1f)(screen.gl, prog, uArg[0], uValue);
                    break;
                case '3f-list':
                    for (var i = 0; i < uValue.length; i++) {
                        var v = uValue[i];
                        (0, shader_1.setUniform3fv)(screen.gl, prog, uArg[0], [v[0], v[1], v[2]], i);
                    }
                    break;
            }
        }
        cont.dirty = false;
    }
    exports.procUniformArgs = procUniformArgs;
    function render3d(screen, cont, objMat, s) {
        switch (s[0]) {
            case "nop":
                return;
            case "offset":
                var nMat = gl_matrix_1.mat4.create();
                gl_matrix_1.mat4.identity(OFF_MAT);
                gl_matrix_1.mat4.translate(OFF_MAT, OFF_MAT, [s[1], s[2], s[3]]);
                gl_matrix_1.mat4.multiply(nMat, objMat, OFF_MAT);
                render3d(screen, cont, nMat, s[4]);
                return;
            case "rotate":
                var nMat = gl_matrix_1.mat4.create();
                gl_matrix_1.mat4.rotateY(nMat, objMat, (s[1] * Math.PI) / 180);
                render3d(screen, cont, nMat, s[2]);
                return;
            case "list":
                var list = s[1];
                for (var i = 0; i < list.length; i++) {
                    render3d(screen, cont, objMat, list[i]);
                }
                return;
            case "mesh":
                var sprite = sprite_list_1.GSpriteList.get(s[2]);
                if (sprite === null)
                    return;
                var meshN = mesh_list_1.GMeshList.loadName(screen.gl, s[1]);
                if (meshN === null)
                    return;
                var flx = s[3].map(function (i) { return [0, i]; });
                (0, sprite_1.setSpriteFrameList)(screen.gl, sprite, flx);
                procUniformArgs(screen, cont);
                (0, mesh_1.drawMesh)(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0, cont.alpha], 0.0, meshN, sprite);
                return;
            case "meshPaint":
                var image = image_list_1.GImageList.get(s[2]);
                if (image === undefined)
                    return;
                var tBuf = mesh_list_1.GMeshList.spareBuf;
                if (tBuf === null)
                    return;
                var meshN = mesh_list_1.GMeshList.loadName(screen.gl, s[1]);
                if (meshN === null)
                    return;
                (0, sprite_1.setPaintFrame)(screen.gl, tBuf, image, s[3]);
                procUniformArgs(screen, cont);
                (0, mesh_1.drawMeshWithImageBuf)(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0, cont.alpha], 0.0, meshN, image, tBuf);
                return;
            case "sprite":
                // find sprite + mesh
                var sprite = sprite_list_1.GSpriteList.get(s[1]);
                if (sprite === null)
                    return;
                var facing = s[3];
                (0, sprite_1.setSpriteFrame)(screen.gl, sprite, s[2], s[3]);
                var mesh = mesh_list_1.GMeshList.loadSquareZ(screen.gl, sprite.mx, sprite.my, sprite.image.name);
                if (mesh === null)
                    return;
                // calculate offset based on direction facing
                var offX = sprite.offset[0];
                var frameWidth = sprite.sheetList[0].frameSize[0] * sprite_1.TILE_SIZE;
                if (facing)
                    offX = frameWidth - (offX + sprite.offWidth);
                // apply adjustments
                var nMat = gl_matrix_1.mat4.create();
                gl_matrix_1.mat4.copy(nMat, objMat);
                gl_matrix_1.mat4.translate(nMat, nMat, [-offX / sprite_1.TILE_SIZE, -sprite.offset[1] / sprite_1.TILE_SIZE, 0.0]);
                // draw
                procUniformArgs(screen, cont);
                (0, mesh_1.drawMesh)(screen.gl, cont.shader, nMat, [1.0, 1.0, 1.0, cont.alpha], 1.0, mesh, sprite);
                return;
            case "alpha":
                var oldAlpha = cont.alpha;
                cont.alpha = s[1];
                render3d(screen, cont, objMat, s[2]);
                cont.alpha = oldAlpha;
                return;
            case "flag":
                var flagName = s[1];
                if (cont.uMap[flagName] !== undefined) {
                    var oldValue = cont.uMap[flagName][2];
                    cont.uMap[flagName][2] = s[2];
                    cont.dirty = true;
                    render3d(screen, cont, objMat, s[3]);
                    cont.uMap[flagName][2] = oldValue;
                    cont.dirty = true;
                }
                else {
                    render3d(screen, cont, objMat, s[3]);
                }
                return;
        }
    }
    exports.render3d = render3d;
});
