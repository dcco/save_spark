define(["require", "exports", "z/shader/shader", "z/shader/buffer"], function (require, exports, shader_1, buffer_1) {
    "use strict";
    exports.__esModule = true;
    exports.make2DMesh = exports.makeMesh = exports.drawMeshWithImageBuf = exports.drawMeshWithBuf = exports.drawMesh = exports.drawVBuf = void 0;
    function drawVBuf(gl, shader, objMat, color, tBuf, vBuf, texImage) {
        (0, shader_1.setAttribVec)(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texImage.texId);
        (0, shader_1.setUniformMat)(gl, shader, shader.uObj, objMat);
        (0, shader_1.setUniform4f)(gl, shader, shader.uColor, color);
        gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
    }
    exports.drawVBuf = drawVBuf;
    function drawMesh(gl, shader, objMat, color, spFlag, mesh, sprite) {
        var tBuf = sprite.tBuf;
        var vBuf = mesh.vBuf;
        var nBuf = mesh.nBuf;
        (0, shader_1.setAttribVec)(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sprite.image.texId);
        (0, shader_1.setUniformMat)(gl, shader, shader.uObj, objMat);
        (0, shader_1.setUniform1f)(gl, shader, shader.uSprite, spFlag);
        (0, shader_1.setUniform4f)(gl, shader, shader.uColor, color);
        gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
    }
    exports.drawMesh = drawMesh;
    function drawMeshWithBuf(gl, shader, objMat, color, spFlag, mesh, tBuf) {
        var vBuf = mesh.vBuf;
        var nBuf = mesh.nBuf;
        (0, shader_1.setAttribVec)(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);
        (0, shader_1.setUniformMat)(gl, shader, shader.uObj, objMat);
        (0, shader_1.setUniform1f)(gl, shader, shader.uSprite, spFlag);
        (0, shader_1.setUniform4f)(gl, shader, shader.uColor, color);
        gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
    }
    exports.drawMeshWithBuf = drawMeshWithBuf;
    function drawMeshWithImageBuf(gl, shader, objMat, color, spFlag, mesh, image, tBuf) {
        var vBuf = mesh.vBuf;
        var nBuf = mesh.nBuf;
        (0, shader_1.setAttribVec)(gl, shader, shader.aPos, vBuf.data, vBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aTex, tBuf.data, tBuf.itemSize);
        (0, shader_1.setAttribVec)(gl, shader, shader.aNorm, nBuf.data, nBuf.itemSize);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, image.texId);
        (0, shader_1.setUniformMat)(gl, shader, shader.uObj, objMat);
        (0, shader_1.setUniform1f)(gl, shader, shader.uSprite, spFlag);
        (0, shader_1.setUniform4f)(gl, shader, shader.uColor, color);
        gl.drawArrays(gl.TRIANGLES, 0, vBuf.numItems);
    }
    exports.drawMeshWithImageBuf = drawMeshWithImageBuf;
    function makeMesh(vBuf, nBuf) {
        return { 'vBuf': vBuf, 'nBuf': nBuf };
    }
    exports.makeMesh = makeMesh;
    var FlatNBuffer = {
        data: null
    };
    function make2DMesh(gl, vBuf) {
        if (FlatNBuffer.data === null) {
            var vs = (0, buffer_1.squareZVertices)([0, 0], [1, 1], 0);
            var nBuf = (0, buffer_1.makeNormBuffer)(gl, vs, "generic 2d normal buffer");
            FlatNBuffer.data = nBuf;
        }
        return { 'vBuf': vBuf, 'nBuf': FlatNBuffer.data };
    }
    exports.make2DMesh = make2DMesh;
});
