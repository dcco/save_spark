define(["require", "exports", "z/mat/sprite", "z/sys/canvas/image-list"], function (require, exports, sprite_1, image_list_1) {
    "use strict";
    exports.__esModule = true;
    exports.addSprite = exports.findOffset = exports.addXSheet = exports.addTileset = exports.GSpriteList = void 0;
    exports.GSpriteList = {
        data: {},
        get: function (name) {
            if (this.data[name] !== undefined) {
                return this.data[name];
            }
            else if (!this.complete) {
                return null;
            }
            else {
                throw ("sprite-list.js - Attempted to access non-existent texture " + name + ".");
            }
        },
        complete: false
    };
    function addTileset(gl, iName, sName, pos, framesPerRow) {
        var image = image_list_1.GImageList.get(iName);
        var sprite = (0, sprite_1.makeSprite)(gl, image, [{
                'dim': sprite_1.TILE_SIZE,
                'pos': pos,
                'framesPerRow': framesPerRow,
                'frameSize': [1, 1]
            }]);
        exports.GSpriteList.data[sName] = sprite;
    }
    exports.addTileset = addTileset;
    function addXSheet(gl, iName, sName, pos, framesPerRow, frameSize) {
        var image = image_list_1.GImageList.get(iName);
        var sprite = (0, sprite_1.makeSprite)(gl, image, [{
                'dim': sprite_1.TILE_SIZE,
                'pos': pos,
                'framesPerRow': framesPerRow,
                'frameSize': frameSize
            }]);
        exports.GSpriteList.data[sName] = sprite;
    }
    exports.addXSheet = addXSheet;
    function checkPixel(c1, c2) {
        return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] !== 0;
    }
    function findOffset(image, srcWidth, pos, frameSize) {
        var tx = pos[0] * sprite_1.TILE_SIZE;
        var ty = pos[1] * sprite_1.TILE_SIZE;
        var width = frameSize[0] * sprite_1.TILE_SIZE;
        var height = frameSize[1] * sprite_1.TILE_SIZE;
        var data = image.data;
        function findOff() {
            for (var i = tx; i < tx + width; i++) {
                for (var j_1 = ty; j_1 < ty + height; j_1++) {
                    var c = (i + (j_1 * srcWidth)) * 4;
                    var color = [data[c], data[c + 1], data[c + 2], data[c + 3]];
                    if (checkPixel(color, [127, 201, 255])) {
                        return [i - tx, j_1 - ty];
                    }
                }
            }
            return [0, 0];
        }
        var _a = findOff(), offX = _a[0], offY = _a[1];
        for (var i = tx + offX + 1; i < tx + width; i++) {
            var j = (ty + offY);
            var c = (i + (j * srcWidth)) * 4;
            var color = [data[c], data[c + 1], data[c + 2], data[c + 3]];
            if (!checkPixel(color, [127, 201, 255])) {
                return [offX, offY, i - (tx + offX)];
            }
        }
        return [offX, offY, width - offX];
    }
    exports.findOffset = findOffset;
    function addSprite(gl, iName, sName, pos, framesPerRow, frameSize, manualFlag, offset) {
        var image = image_list_1.GImageList.get(iName);
        var sprite = (0, sprite_1.makeSprite)(gl, image, [{
                'dim': sprite_1.TILE_SIZE,
                'pos': pos,
                'framesPerRow': framesPerRow,
                'frameSize': frameSize
            }]);
        if (manualFlag) {
            var offX = offset[0], offY = offset[1], offWidth = offset[2];
            sprite.offset = [offX, offY];
            sprite.offWidth = offWidth;
        }
        if (image.src !== null) {
            var _a = findOffset(image.src.imageData, image.width, pos, frameSize), offX = _a[0], offY = _a[1], offWidth = _a[2];
            sprite.offset = [offX, offY];
            sprite.offWidth = offWidth;
        }
        exports.GSpriteList.data[sName] = sprite;
    }
    exports.addSprite = addSprite;
});
