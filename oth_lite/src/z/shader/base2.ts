
	/* vertex shader */
export var BASE2_V_SHADER = `#version 300 es

precision highp float;

in vec3 aPos;
in vec2 aTex;

uniform mat4 uMVMat;
uniform mat4 uPMat;

out vec2 vTex;

void main(void) {
	gl_Position = uPMat * uMVMat * vec4(aPos, 1.0);
	vTex = aTex;
}

`;

	/* fragment shader */
export var BASE2_F_SHADER = `#version 300 es

precision mediump float;

in vec2 vTex;

uniform vec4 uColor;
uniform sampler2D uSampler;

out vec4 FragColor;

void main(void) {
	vec4 texColor = texture(uSampler, vTex);
	if (texColor.a == 0.0) discard;
	FragColor = vec4(texColor.rgb * uColor.rgb, texColor.a * uColor.a);
}

`;