#version 300 es

precision mediump float;

out vec4 gColor;

uniform sampler2D uSampler;

uniform float isBack;

in vec4 vPos;
in vec2 vTexCoord;

void main()
{
	if (isBack > 0.5) discard;
	float alpha = texture(uSampler, vTexCoord).a;
	if (alpha == 0.0) discard;
}