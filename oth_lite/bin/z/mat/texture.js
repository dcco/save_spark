define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.buildTexImage = exports.defTexImage = exports.fixedTexImageFloat = exports.fixedTexImage = void 0;
    function fixedTexImage(gl, size, rawData) {
        // initialize texture data
        var texId = gl.createTexture();
        if (texId === null)
            throw ("texture.js - Failed to create texture surface for fixed image.");
        var w = size[0], h = size[1];
        gl.bindTexture(gl.TEXTURE_2D, texId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, rawData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // initialize texture buffer and return data
        //var tBuf = makeTexBuffer(gl, squareTexCoords(), "default image");
        return {
            src: null,
            name: "fixed image",
            width: w,
            height: h,
            texId: texId
        };
    }
    exports.fixedTexImage = fixedTexImage;
    function fixedTexImageFloat(gl, size, rawData) {
        // initialize texture data
        var texId = gl.createTexture();
        if (texId === null)
            throw ("texture.js - Failed to create texture surface for fixed (float) image.");
        var w = size[0], h = size[1];
        gl.bindTexture(gl.TEXTURE_2D, texId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, rawData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // initialize texture buffer and return data
        //var tBuf = makeTexBuffer(gl, squareTexCoords(), "default image");
        return {
            src: null,
            name: "float image",
            width: w,
            height: h,
            texId: texId
        };
    }
    exports.fixedTexImageFloat = fixedTexImageFloat;
    function defTexImage(gl) {
        return fixedTexImage(gl, [2, 2], new Uint8Array([
            255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255
        ]));
    }
    exports.defTexImage = defTexImage;
    function buildTexImage(gl, image, data) {
        // initialize texture data
        var texId = gl.createTexture();
        if (texId === null)
            throw ("texture.js - Failed to create texture surface for `" + image.src + "`.");
        gl.bindTexture(gl.TEXTURE_2D, texId);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // initialize texture buffer and return data
        //var tBuf = makeTexBuffer(gl, squareTexCoords(), "`" + image.src + "`");
        return {
            src: {
                rawImage: image,
                imageData: data
            },
            name: image.src,
            width: image.width,
            height: image.height,
            texId: texId
            //tBuf: tBuf
        };
    }
    exports.buildTexImage = buildTexImage;
});
