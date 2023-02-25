#version 300 es

precision highp float;

out vec4 FragColor;

in vec2 xTexCoord;

uniform sampler2D gColor;
uniform sampler2D gSpec;

uniform float passFlag;

const float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main()
{
	vec4 vColor = texture(gColor, xTexCoord);
	ivec2 texSize = textureSize(gColor, 0);
	vec2 texOffset = vec2(1.0 / float(texSize.x), 1.0 / float(texSize.y));
	vec3 result = vColor.rgb * weight[0];
	if (passFlag < 0.5) {
		for (int i = 1; i < 5; i++) {
			result = result + texture(gColor, xTexCoord + vec2(texOffset.x * float(i), 0.0)).rgb * weight[i];
			result = result + texture(gColor, xTexCoord - vec2(texOffset.x * float(i), 0.0)).rgb * weight[i];	
		}
	} else {
		for (int i = 1; i < 5; i++) {
			result = result + texture(gColor, xTexCoord + vec2(0.0, texOffset.y * float(i))).rgb * weight[i];
			result = result + texture(gColor, xTexCoord - vec2(0.0, texOffset.y * float(i))).rgb * weight[i];	
		}
	}
	FragColor = vec4(result, vColor.a);
}