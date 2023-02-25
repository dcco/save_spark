define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.makeNormBuffer = exports.updateVertBuffer = exports.makeVertBuffer = exports.squareYVertices = exports.squareXVertices = exports.squareZVertices = exports.quadVertices = exports.updateTexBuffer = exports.makeTexBuffer = exports.squareTexCoords = void 0;
    /* texture buffer manipulation functions */
    function squareTexCoords() {
        return [
            0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0
        ];
    }
    exports.squareTexCoords = squareTexCoords;
    function makeTexBuffer(gl, texCoords, name) {
        var rawBuf = gl.createBuffer();
        if (rawBuf === null)
            throw ("buffer.js - Failed to create texture coordinate buffer for " + name + ".");
        var tBuf = {
            data: rawBuf,
            itemSize: 2
        };
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuf.data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        return tBuf;
    }
    exports.makeTexBuffer = makeTexBuffer;
    function updateTexBuffer(gl, tBuf, texCoords, dType) {
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuf.data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), dType);
    }
    exports.updateTexBuffer = updateTexBuffer;
    /* vertex buffer manipulation functions */
    // must give the vertices in ccw order
    function quadVertices(p1, p2, p3, p4) {
        return [
            p1[0], p1[1], p1[2],
            p2[0], p2[1], p2[2],
            p3[0], p3[1], p3[2],
            p1[0], p1[1], p1[2],
            p3[0], p3[1], p3[2],
            p4[0], p4[1], p4[2]
        ];
    }
    exports.quadVertices = quadVertices;
    function squareZVertices(pos, size, z) {
        var l = pos[0];
        var r = pos[0] + size[0];
        var t = pos[1];
        var b = pos[1] + size[1];
        return [
            l, t, z,
            r, b, z,
            r, t, z,
            l, t, z,
            l, b, z,
            r, b, z
        ];
    }
    exports.squareZVertices = squareZVertices;
    function squareXVertices(pos, size, x) {
        var l = pos[0];
        var r = pos[0] + size[0];
        var t = pos[1];
        var b = pos[1] + size[1];
        return [
            x, t, l,
            x, b, r,
            x, t, r,
            x, t, l,
            x, b, l,
            x, b, r
        ];
    }
    exports.squareXVertices = squareXVertices;
    function squareYVertices(pos, size, y) {
        var l = pos[0];
        var r = pos[0] + size[0];
        var t = pos[1];
        var b = pos[1] + size[1];
        return [
            l, y, t,
            r, y, b,
            r, y, t,
            l, y, t,
            l, y, b,
            r, y, b
        ];
    }
    exports.squareYVertices = squareYVertices;
    function makeVertBuffer(gl, vertices, name) {
        var rawBuf = gl.createBuffer();
        if (rawBuf === null)
            throw ("buffer.js - Failed to create vertex buffer for `" + name + "`.");
        var vBuf = {
            data: rawBuf,
            itemSize: 3,
            numItems: Math.floor(vertices.length / 3)
        };
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf.data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return vBuf;
    }
    exports.makeVertBuffer = makeVertBuffer;
    function updateVertBuffer(gl, vBuf, vertices, dType) {
        vBuf.numItems = Math.floor(vertices.length / vBuf.itemSize);
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf.data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), dType);
    }
    exports.updateVertBuffer = updateVertBuffer;
    function getNorm(i, j, k) {
        var a = [k[0] - i[0], k[1] - i[1], k[2] - i[2]];
        var b = [j[0] - i[0], j[1] - i[1], j[2] - i[2]];
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    }
    function vertToNormList(vs) {
        var normList = [];
        var vertNumber = Math.floor(vs.length / 9);
        for (var i = 0; i < vertNumber; i++) {
            var ix = i * 9;
            var _a = getNorm([vs[ix], vs[ix + 1], vs[ix + 2]], [vs[ix + 3], vs[ix + 4], vs[ix + 5]], [vs[ix + 6], vs[ix + 7], vs[ix + 8]]), n1 = _a[0], n2 = _a[1], n3 = _a[2];
            var mag = Math.sqrt(n1 * n1 + n2 * n2 + n3 * n3);
            n1 = n1 / mag;
            n2 = n2 / mag;
            n3 = n3 / mag;
            for (var j = 0; j < 3; j++) {
                normList.push(n1);
                normList.push(n2);
                normList.push(n3);
            }
        }
        return normList;
    }
    function makeNormBuffer(gl, vertices, name) {
        var rawBuf = gl.createBuffer();
        if (rawBuf === null)
            throw ("buffer.js - Failed to create normal buffer for `" + name + "`.");
        var nBuf = {
            data: rawBuf,
            itemSize: 3
        };
        var normList = vertToNormList(vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuf.data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW);
        return nBuf;
    }
    exports.makeNormBuffer = makeNormBuffer;
});
