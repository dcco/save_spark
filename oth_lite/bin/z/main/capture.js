define(["require", "exports", "gl-matrix", "z/shader/buffer", "z/mat/texture", "z/mat/mesh"], function (require, exports, gl_matrix_1, buffer_1, texture_1, mesh_1) {
    "use strict";
    exports.__esModule = true;
    exports.Capture = void 0;
    function nextPow2(n) {
        var sz = 2.0;
        while (sz < n) {
            sz = sz * 2.0;
            if (sz >= 4096.0)
                return 4096.0;
        }
        return sz;
    }
    function Capture(gl, settings) {
        // calculate capture card size
        var ZOOM = Math.floor(settings.zoom);
        if (ZOOM < 1.0)
            ZOOM = 1.0;
        var focusHeight = Math.floor(settings.height / ZOOM);
        var cWidth = nextPow2(Math.floor(settings.width / ZOOM));
        var cHeight = nextPow2(focusHeight);
        var mY = (cHeight - focusHeight) * ZOOM;
        // initialize buffers
        var cw = cWidth * ZOOM;
        var ch = cHeight * ZOOM;
        var vertices = [
            0.0, -mY, 0.0,
            cw, -mY, 0.0,
            cw, ch - mY, 0.0,
            0.0, -mY, 0.0,
            cw, ch - mY, 0.0,
            0.0, ch - mY, 0.0
        ];
        var cvBuf = (0, buffer_1.makeVertBuffer)(gl, vertices, "capture card");
        var texCoords = [
            0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 0.0, 0.0, 0.0
        ];
        var ctBuf = (0, buffer_1.makeTexBuffer)(gl, texCoords, "capture card");
        var texSrc = (0, texture_1.defTexImage)(gl);
        var Z_MAT = gl_matrix_1.mat4.create();
        // return capture object
        return {
            'copy': function () {
                gl.bindTexture(gl.TEXTURE_2D, texSrc.texId);
                gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, settings.height - focusHeight, cWidth, cHeight, 0);
            },
            'draw': function (prog) {
                (0, mesh_1.drawVBuf)(gl, prog, Z_MAT, [1, 1, 1, 1], ctBuf, cvBuf, texSrc);
            }
        };
    }
    exports.Capture = Capture;
});
/*

export function Capture(gl: GL, settings: Settings): Capture {

    // calculate capture card size
    var ZOOM = Math.floor(settings.zoom);
    if (ZOOM < 1.0) ZOOM = 1.0;
    var size = settings.width;
    if (settings.height > size) size = settings.height;
    var pSize = Math.floor(size / ZOOM);
    var cSize = nextPow2(pSize);
    var partHeight = Math.floor(settings.height / ZOOM);
    var mY = (cSize - partHeight) * ZOOM;
    // initialize buffers
    var cs = cSize * ZOOM;
    var vertices = [
        0.0, -mY, 0.0,
        cs, -mY, 0.0,
        cs, cs - mY, 0.0,
        0.0, -mY, 0.0,
        cs, cs - mY, 0.0,
        0.0, cs - mY, 0.0
    ];
    var cvBuf = makeVertBuffer(gl, vertices, "capture card");
    var texCoords = [
        0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.0, 1.0, 1.0, 0.0, 0.0, 0.0
    ];
    var ctBuf = makeTexBuffer(gl, texCoords, "capture card");
    var texSrc = defTexImage(gl);

    var Z_MAT = mat4.create();

    // return capture object
    return {
        'copy': function() {
            gl.bindTexture(gl.TEXTURE_2D, texSrc.texId);
            gl.copyTexImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA,
                0, settings.height - partHeight, cSize, cSize, 0
            );
        },
        'draw': function(prog) {
            drawVBuf(gl, prog, Z_MAT, [1, 1, 1, 1], ctBuf, cvBuf, texSrc);
        }
    };
}*/
/*

export function Capture(gl: GL, settings: Settings): Capture {

    // calculate capture card size
    var ZOOM = Math.floor(settings.zoom);
    if (ZOOM < 1.0) ZOOM = 1.0;
    var cWidth = nextPow2(Math.floor(settings.width / ZOOM));
    var cHeight = nextPow2(Math.floor(settings.height / ZOOM));
    var mY = (cHeight - Math.floor(settings.height / ZOOM)) * ZOOM;
    mY = 0.0;
    console.log(cWidth, cHeight);
    // initialize buffers
    var cw = cWidth * ZOOM;
    var ch = cHeight * ZOOM;
    console.log(cw, ch);
    var vertices = [
        0.0, -mY, 0.0,
        cw, -mY, 0.0,
        cw, ch - mY, 0.0,
        0.0, -mY, 0.0,
        cw, ch - mY, 0.0,
        0.0, ch - mY, 0.0
    ];
    var cvBuf = makeVertBuffer(gl, vertices, "capture card");
    var texCoords = [
        0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.0, 1.0, 1.0, 0.0, 0.0, 0.0
    ];
    var ctBuf = makeTexBuffer(gl, texCoords, "capture card");
    var texSrc = defTexImage(gl);

    var Z_MAT = mat4.create();

    // return capture object
    var partHeight = Math.floor(settings.height / ZOOM);
    return {
        'copy': function() {
            gl.bindTexture(gl.TEXTURE_2D, texSrc.texId);
            gl.copyTexImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA,
                0, partHeight, cWidth, cHeight, 0
            );
        },
        'draw': function(prog) {
            drawVBuf(gl, prog, Z_MAT, [1, 1, 1, 1], ctBuf, cvBuf, texSrc);
        }
    };
}*/ 
