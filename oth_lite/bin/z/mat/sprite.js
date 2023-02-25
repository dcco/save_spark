define(["require", "exports", "z/shader/buffer"], function (require, exports, buffer_1) {
    "use strict";
    exports.__esModule = true;
    exports.setPaintFrame = exports.setSpriteFrameList = exports.setSpriteFrame = exports.makeDefSprite = exports.makeSprite = exports.frameListTexCoords = exports.frameTexCoords = exports.paintTexCoords = exports.setTileSize = exports.TILE_SIZE = void 0;
    exports.TILE_SIZE = 16;
    function setTileSize(ts) {
        exports.TILE_SIZE = ts;
    }
    exports.setTileSize = setTileSize;
    function paintTexCoords(image, sheet) {
        var texCoords = [];
        for (var i = 0; i < sheet.length; i++) {
            var _a = sheet[i], tx = _a[0], ty = _a[1], pw = _a[2], ph = _a[3];
            var cx = (tx * exports.TILE_SIZE) / image.width;
            var cy = (ty * exports.TILE_SIZE) / image.height;
            var cw = pw / image.width;
            var ch = ph / image.height;
            var fl = [
                cx, cy, cx + cw, cy + ch, cx + cw, cy,
                cx, cy, cx, cy + ch, cx + cw, cy + ch
            ];
            texCoords = texCoords.concat(fl);
        }
        return texCoords;
    }
    exports.paintTexCoords = paintTexCoords;
    function frameTexCoords(image, sheet, frame, facing) {
        var i = Math.floor(frame % sheet.framesPerRow);
        var j = Math.floor(frame / sheet.framesPerRow);
        var sx = (sheet.pos[0] + (i * sheet.frameSize[0])) * sheet.dim / image.width;
        var sy = (sheet.pos[1] + (j * sheet.frameSize[1])) * sheet.dim / image.height;
        var w = (sheet.frameSize[0] * sheet.dim) / image.width;
        var h = (sheet.frameSize[1] * sheet.dim) / image.height;
        var _a = [sx, sx + w], l = _a[0], r = _a[1];
        if (facing) {
            l = r;
            r = sx;
        }
        return [
            l, sy, r, sy + h, r, sy,
            l, sy, l, sy + h, r, sy + h
        ];
    }
    exports.frameTexCoords = frameTexCoords;
    function frameListTexCoords(image, sheetList, frameList) {
        var texCoords = [];
        for (var i = 0; i < frameList.length; i++) {
            var _a = frameList[i], sheetId = _a[0], frame = _a[1];
            texCoords = texCoords.concat(frameTexCoords(image, sheetList[sheetId], frame, false));
        }
        return texCoords;
    }
    exports.frameListTexCoords = frameListTexCoords;
    function makeSprite(gl, texImage, sheetList) {
        var tBuf = (0, buffer_1.makeTexBuffer)(gl, frameTexCoords(texImage, sheetList[0], 0, false), texImage.name);
        var ix = Math.ceil(sheetList[0].dim * sheetList[0].frameSize[0] / exports.TILE_SIZE);
        var iy = Math.ceil(sheetList[0].dim * sheetList[0].frameSize[1] / exports.TILE_SIZE);
        return { 'image': texImage, 'sheetList': sheetList, 'tBuf': tBuf, 'mx': ix, 'my': iy, 'offset': [0, 0], 'offWidth': ix };
    }
    exports.makeSprite = makeSprite;
    function makeDefSprite(gl, texImage) {
        var dim = Math.min(texImage.width, texImage.height);
        var sheetList = [{ 'dim': dim, 'pos': [0, 0], 'framesPerRow': 1, 'frameSize': [1, 1] }];
        return makeSprite(gl, texImage, sheetList);
    }
    exports.makeDefSprite = makeDefSprite;
    function setSpriteFrame(gl, sprite, frame, facing) {
        var texCoords = frameTexCoords(sprite.image, sprite.sheetList[0], frame, facing);
        (0, buffer_1.updateTexBuffer)(gl, sprite.tBuf, texCoords, gl.DYNAMIC_DRAW);
    }
    exports.setSpriteFrame = setSpriteFrame;
    function setSpriteFrameList(gl, sprite, frameList) {
        var texCoords = frameListTexCoords(sprite.image, sprite.sheetList, frameList);
        (0, buffer_1.updateTexBuffer)(gl, sprite.tBuf, texCoords, gl.DYNAMIC_DRAW);
    }
    exports.setSpriteFrameList = setSpriteFrameList;
    function setPaintFrame(gl, tBuf, image, sheet) {
        var texCoords = paintTexCoords(image, sheet);
        (0, buffer_1.updateTexBuffer)(gl, tBuf, texCoords, gl.DYNAMIC_DRAW);
    }
    exports.setPaintFrame = setPaintFrame;
});
