#version 300 es

precision highp float;

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 xTexCoord;
out vec3 xPos;

void main(void) {
	xTexCoord = aTexCoord;
	xPos = aPos;
	gl_Position = vec4(aPos, 1.0);
}