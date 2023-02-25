define(["require", "exports", "gl-matrix", "z/shader/shader", "z/sys/canvas/scene"], function (require, exports, gl_matrix_1, shader_1, scene_1) {
    "use strict";
    exports.__esModule = true;
    exports.base2Equip = exports.base2Draw = exports.BaseShader = void 0;
    var MV_MAT = gl_matrix_1.mat4.create();
    function BaseShader(settings) {
        var pMat = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.ortho(pMat, 0.0, settings.width, settings.height, 0.0, -1.0, 1.0);
        var mvMat = gl_matrix_1.mat4.create();
        return {
            'pMat': pMat, 'mvMat': mvMat
        };
    }
    exports.BaseShader = BaseShader;
    function base2Draw(screen, shader, scene) {
        var gl = screen.gl;
        var shaderProg = screen.baseProg;
        // equip shader
        (0, shader_1.useShader)(gl, shaderProg);
        (0, shader_1.clearShaderS)(screen);
        // write to perspective / model-view matrix
        (0, shader_1.setUniformMat)(gl, shaderProg, shaderProg.uPers, shader.pMat);
        (0, scene_1.render)(screen, { 'shader': shaderProg, 'colorFlag': null }, shader.mvMat, scene);
    }
    exports.base2Draw = base2Draw;
    function base2Equip(screen, shader) {
        var gl = screen.gl;
        var shaderProg = screen.baseProg;
        // equip shader
        (0, shader_1.useShader)(gl, shaderProg);
        (0, shader_1.setUniformMat)(gl, shaderProg, shaderProg.uPers, shader.pMat);
    }
    exports.base2Equip = base2Equip;
});
