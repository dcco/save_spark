define(["require", "exports", "gl-matrix", "z/mat/sprite", "z/mat/mesh", "z/sys/cb/gbox", "z/sys/cb/text", "z/sys/canvas/sprite-list", "z/sys/canvas/mesh-list"], function (require, exports, gl_matrix_1, sprite_1, mesh_1, gbox_1, text_1, sprite_list_1, mesh_list_1) {
    "use strict";
    exports.__esModule = true;
    exports.render = void 0;
    function toFloatColor(c, a) {
        return [c[1] / 256.0, c[2] / 256.0, c[3] / 256.0, a];
    }
    var OFF_MAT = gl_matrix_1.mat4.create();
    function render(screen, cont, objMat, s) {
        switch (s[0]) {
            case "nop":
                return;
            case "box":
                if (gbox_1.GBox.data === null)
                    return;
                var fc = toFloatColor(s[1], s[2]);
                var _a = s[3], _ = _a[0], x = _a[1], y = _a[2], w = _a[3], h = _a[4];
                gbox_1.GBox.setVBuf(screen.gl, x, y, w, h);
                (0, mesh_1.drawMesh)(screen.gl, cont.shader, objMat, fc, 0.0, gbox_1.GBox.data.mesh, gbox_1.GBox.data.sprite);
                return;
            case "offset":
                var nMat = gl_matrix_1.mat4.create();
                gl_matrix_1.mat4.identity(OFF_MAT);
                gl_matrix_1.mat4.translate(OFF_MAT, OFF_MAT, [s[1], s[2], 0.0]);
                gl_matrix_1.mat4.multiply(nMat, objMat, OFF_MAT);
                render(screen, cont, nMat, s[3]);
                return;
            case "list":
                var list = s[1];
                for (var i = 0; i < list.length; i++) {
                    render(screen, cont, objMat, list[i]);
                }
                return;
            case "image":
                return render(screen, cont, objMat, ["sprite", s[1], 0, false]);
            case "sprite":
                // find sprite + mesh
                var spriteN = sprite_list_1.GSpriteList.get(s[1]);
                if (spriteN === null)
                    return;
                var facing = s[3];
                (0, sprite_1.setSpriteFrame)(screen.gl, spriteN, s[2], s[3]);
                var mesh = mesh_list_1.GMeshList.loadSquareZ(screen.gl, spriteN.mx * sprite_1.TILE_SIZE, spriteN.my * sprite_1.TILE_SIZE, spriteN.image.name);
                if (mesh === null)
                    return;
                // calculate offset based on direction facing
                var offX = spriteN.offset[0];
                var frameWidth = spriteN.sheetList[0].frameSize[0] * sprite_1.TILE_SIZE;
                if (facing)
                    offX = frameWidth - (offX + spriteN.offWidth);
                var nMat = gl_matrix_1.mat4.create();
                gl_matrix_1.mat4.copy(nMat, objMat);
                gl_matrix_1.mat4.translate(nMat, nMat, [-offX, -spriteN.offset[1], 0.0]);
                // draw
                var color = cont.colorFlag;
                if (color === null)
                    color = [1.0, 1.0, 1.0, 1.0];
                (0, mesh_1.drawMesh)(screen.gl, cont.shader, nMat, color, 1.0, mesh, spriteN);
                return;
            case "color":
                var oldColor = cont.colorFlag;
                cont.colorFlag = toFloatColor(s[1], 1.0);
                render(screen, cont, objMat, s[2]);
                cont.colorFlag = oldColor;
                return;
            case "color4":
                var oldColor = cont.colorFlag;
                cont.colorFlag = toFloatColor(s[1], s[2]);
                render(screen, cont, objMat, s[3]);
                cont.colorFlag = oldColor;
                return;
            case "text":
                render(screen, cont, objMat, text_1.GText.scene(s[1], s[2], s[3]));
                return;
            case "custom":
                var mesh = s[1];
                var sprite = s[2];
                (0, sprite_1.setSpriteFrame)(screen.gl, sprite, s[3], false);
                var color = cont.colorFlag;
                if (color === null)
                    color = [1.0, 1.0, 1.0, 1.0];
                (0, mesh_1.drawMesh)(screen.gl, cont.shader, objMat, color, 0.0, mesh, sprite);
                return;
        }
    }
    exports.render = render;
});
/*
export function SCustomImage(mesh: Mesh, s: Sprite, frame: number): Scene {
    var r = {
        id: 'c-image',
        childList: [],
        draw: function(screen, cont, objMat) {
            setSpriteFrame(screen.gl, s, frame, false);
            drawMesh(screen.gl, cont.shader, objMat, [1.0, 1.0, 1.0], mesh, s);
        }
    };
    return r;
}

export function SImage(sName: string, frame: number, facing: boolean): Scene {
    var r = {
        id: 'image',
        childList: [],
        draw: function(screen, cont, objMat) {
            // find sprite + mesh
            var sprite = GSpriteList.get(sName);
            if (sprite === null) return;
            setSpriteFrame(screen.gl, sprite, frame, facing);
            var mesh = GMeshList.loadSquareZ(screen.gl, sprite.mx * TILE_SIZE, sprite.my * TILE_SIZE, sprite.image.name);
            // calculate offset based on direction facing
            var offX = sprite.offset[0];
            var frameWidth = sprite.sheetList[0].frameSize[0] * TILE_SIZE;
            if (facing) offX = frameWidth - (offX + sprite.offWidth);
            // apply adjust for shadow frame buffer
            var offZ = 0.0;
            if (cont.shadowFlag) offZ = -0.1;
            var nMat = mat4.create();
            mat4.copy(nMat, objMat);
            mat4.translate(nMat, nMat, [-offX / TILE_SIZE, -sprite.offset[1] / TILE_SIZE, offZ]);
            // draw
            drawMesh(screen.gl, cont.shader, nMat, [1.0, 1.0, 1.0], mesh, sprite);
        }
    };
    return r;
};

const OFF_MAT = mat4.create();

export function SOffset(x: number, y: number, s: Scene): Scene {
    var r = {
        id: 'off_' + x + "_" + y,
        childList: [s],
        draw: function(screen, cont, objMat) {
            var nMat = mat4.create();
            mat4.identity(OFF_MAT);
            mat4.translate(OFF_MAT, OFF_MAT, [x, y, 0.0]);
            mat4.multiply(nMat, objMat, OFF_MAT);
            //mat4.copy(nMat, objMat);
            //mat4.translate(nMat, nMat, [x, y, 0.0]);
            s.draw(screen, cont, nMat);
        }
    };
    return r;
};

const S_MAT = mat4.create();

export function SScale(fx: number, fy: number, s: Scene): Scene {
    var r = {
        id: 'scale_' + fx + "_" + fy,
        childList: [s],
        draw: function(screen, cont, objMat) {
            var nMat = mat4.create();
            mat4.identity(S_MAT);
            mat4.scale(S_MAT, S_MAT, [fx, fy, 0.0]);
            mat4.multiply(nMat, objMat, S_MAT);
            //mat4.copy(nMat, objMat);
            //mat4.scale(nMat, nMat, [fx, fy, 0.0]);
            s.draw(screen, cont, nMat);
        }
    };
    return r;
};

export function SList(list: Scene[]): Scene {
    var r = {
        id: 'list',
        childList: list,
        draw: function(screen, cont, objMat) {
            var s = GSpriteList.get("test_box");
            for (var i = 0; i < list.length; i++) {
                list[i].draw(screen, cont, objMat);
            }
        }
    };
    return r;
};

export const SNop: Scene = {
    id: 'nop',
    childList: [],
    draw: function() {}
};*/
/*
function toFloatColor(c: [number, number, number]): [number, number, number] {
    return [c[0] / 256.0, c[1] / 256.0, c[2] / 256.0];
}

export function SBox(color: [number, number, number], x: number, y: number, w: number, h: number): Scene {
    var r = {
        id: 'image',
        childList: [],
        draw: function(screen, cont, objMat) {
            if (GBox.data === null) return;
            var fc = toFloatColor(color);
            GBox.setVBuf(screen.gl, x, y, w, h);
            drawMesh(screen.gl, cont.shader, objMat, fc, GBox.data.mesh, GBox.data.sprite);
        }
    };
    return r;
};*/ 
