define(["require", "exports", "gl-matrix", "z/shader/buffer", "z/shader/shader", "z/shader/frame-buffer", "z/mat/mesh", "z/sys/canvas/scene3d", "z/sys/canvas/mesh-list"], function (require, exports, gl_matrix_1, buffer_1, shader_1, frame_buffer_1, mesh_1, scene3d_1, mesh_list_1) {
    "use strict";
    exports.__esModule = true;
    exports.RenderFunStore = exports.RenderCont = void 0;
    var Z_MAT = gl_matrix_1.mat4.create();
    /* functions for render arguments */
    function useTexture(screen, texDef) {
        switch (texDef[0]) {
            case 'buffer':
                var _ = texDef[0], bufContainer = texDef[1], bName = texDef[2], i = texDef[3];
                if (bufContainer.buf !== null) {
                    var buf = bufContainer.buf;
                    (0, frame_buffer_1.useBufferTexture)(screen.gl, buf, bName, i);
                }
                return;
            case 'tex':
                var gl = screen.gl;
                var _ = texDef[0], texImage = texDef[1], slotId = texDef[2];
                gl.activeTexture((0, frame_buffer_1.texNum)(gl, slotId));
                gl.bindTexture(gl.TEXTURE_2D, texImage.texId);
                return;
        }
    }
    function useTexList(screen, params) {
        if (params.loadTex === undefined)
            return;
        var texList = params.loadTex;
        for (var _i = 0, texList_1 = texList; _i < texList_1.length; _i++) {
            var texDef = texList_1[_i];
            useTexture(screen, texDef);
        }
    }
    function buildCont(prog, args) {
        var uArgs = [];
        var uMap = {};
        if (args === undefined)
            return { 'shader': prog, 'uArgs': uArgs, 'uMap': uMap, 'alpha': 1.0, 'dirty': true };
        uArgs = args;
        for (var _i = 0, uArgs_1 = uArgs; _i < uArgs_1.length; _i++) {
            var uArg = uArgs_1[_i];
            uMap[uArg[0]] = uArg;
        }
        return { 'shader': prog, 'uArgs': uArgs, 'uMap': uMap, 'alpha': 1.0, 'dirty': true };
    }
    /* render functions */
    function shaderDraw(cont, container, pMat, mvMat, s, params) {
        if (container.prog === null)
            return;
        var prog = container.prog;
        var screen = cont.screen;
        (0, shader_1.useShader)(screen.gl, prog);
        (0, shader_1.clearShader)(screen);
        // process args
        //procUniformArgs(screen, prog, params);
        useTexList(screen, params);
        (0, scene3d_1.procUniformArgs)(screen, buildCont(prog, params.uArgs));
        var drawCont = buildCont(prog, params.flagArgs);
        // draw mesh
        (0, shader_1.setUniformMat)(screen.gl, prog, prog.uPers, pMat);
        (0, shader_1.setUniformMat)(screen.gl, prog, prog.uModel, mvMat);
        (0, scene3d_1.render3d)(screen, drawCont, Z_MAT, s);
    }
    function initFrameBuffer(screen, buf, params) {
        if (params["switch"] !== undefined) {
            if (params["switch"].start)
                (0, frame_buffer_1.useFrameBuffer)(screen.gl, buf);
            (0, frame_buffer_1.switchDrawBuffers)(screen.gl, buf, params["switch"].bufList);
        }
        else {
            (0, frame_buffer_1.useFrameBuffer)(screen.gl, buf);
        }
        (0, frame_buffer_1.clearFrameBuffer)(screen.gl, buf);
    }
    function bufferDraw(cont, container, pMat, mvMat, s, params) {
        if (container.buf === null)
            return;
        var buf = container.buf;
        var screen = cont.screen;
        initFrameBuffer(screen, buf, params);
        // process args
        //procUniformArgs(screen, buf.shader, params);
        useTexList(screen, params);
        (0, scene3d_1.procUniformArgs)(screen, buildCont(buf.shader, params.uArgs));
        var drawCont = buildCont(buf.shader, params.flagArgs);
        // draw mesh
        (0, shader_1.setUniformMat)(screen.gl, buf.shader, buf.shader.uPers, pMat);
        (0, shader_1.setUniformMat)(screen.gl, buf.shader, buf.shader.uModel, mvMat);
        (0, scene3d_1.render3d)(screen, drawCont, Z_MAT, s);
    }
    function useContainer(screen, container, params) {
        switch (container[0]) {
            case "shader":
                if (container[1].prog === null)
                    return null;
                var prog = container[1].prog;
                (0, shader_1.useShader)(screen.gl, prog);
                (0, shader_1.clearShader)(screen);
                return prog;
            case "buf":
                if (container[1].buf === null)
                    return null;
                var buf = container[1].buf;
                initFrameBuffer(screen, buf, params);
                return buf.shader;
        }
    }
    function meshDraw(cont, container, pMat, mvMat, mName, tBuf, params) {
        var screen = cont.screen;
        var prog = useContainer(screen, container, params);
        if (prog === null)
            return;
        // find mesh
        var mesh = mesh_list_1.GMeshList.loadName(screen.gl, mName);
        if (mesh === null)
            return;
        // process args
        useTexList(screen, params);
        (0, scene3d_1.procUniformArgs)(screen, buildCont(prog, params.uArgs));
        var drawCont = buildCont(prog, params.flagArgs);
        // draw mesh
        (0, shader_1.setUniformMat)(screen.gl, prog, prog.uPers, pMat);
        (0, shader_1.setUniformMat)(screen.gl, prog, prog.uModel, mvMat);
        (0, mesh_1.drawMeshWithBuf)(screen.gl, prog, Z_MAT, [1, 1, 1, 1], 0.0, mesh, tBuf);
    }
    function RenderCont(iData, screen) {
        var sqBuf = (0, buffer_1.makeTexBuffer)(screen.gl, (0, buffer_1.squareTexCoords)(), "screen-square");
        var tBuf = (0, buffer_1.makeTexBuffer)(screen.gl, (0, buffer_1.squareTexCoords)(), "screen-custom");
        iData.screen = screen;
        iData.shaderDraw = function (container, pMat, mvMat, s, params) {
            shaderDraw(this, container, pMat, mvMat, s, params);
        };
        iData.bufferDraw = function (container, pMat, mvMat, s, params) {
            bufferDraw(this, container, pMat, mvMat, s, params);
        };
        iData.meshDraw = function (container, pMat, mvMat, mName, tType, params) {
            var xBuf = sqBuf;
            if (tType[0] === "custom") {
                (0, buffer_1.updateTexBuffer)(screen.gl, tBuf, tType[1], screen.gl.DYNAMIC_DRAW);
                xBuf = tBuf;
            }
            meshDraw(this, container, pMat, mvMat, mName, xBuf, params);
        };
        return iData;
    }
    exports.RenderCont = RenderCont;
    function RenderFunStore() {
        return { 'rFun': function () { }, 'iData': {} };
    }
    exports.RenderFunStore = RenderFunStore;
});
