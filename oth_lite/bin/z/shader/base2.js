define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.BASE2_F_SHADER = exports.BASE2_V_SHADER = void 0;
    /* vertex shader */
    exports.BASE2_V_SHADER = "#version 300 es\n\nprecision highp float;\n\nin vec3 aPos;\nin vec2 aTex;\n\nuniform mat4 uMVMat;\nuniform mat4 uPMat;\n\nout vec2 vTex;\n\nvoid main(void) {\n\tgl_Position = uPMat * uMVMat * vec4(aPos, 1.0);\n\tvTex = aTex;\n}\n\n";
    /* fragment shader */
    exports.BASE2_F_SHADER = "#version 300 es\n\nprecision mediump float;\n\nin vec2 vTex;\n\nuniform vec4 uColor;\nuniform sampler2D uSampler;\n\nout vec4 FragColor;\n\nvoid main(void) {\n\tvec4 texColor = texture(uSampler, vTex);\n\tif (texColor.a == 0.0) discard;\n\tFragColor = vec4(texColor.rgb * uColor.rgb, texColor.a * uColor.a);\n}\n\n";
});
