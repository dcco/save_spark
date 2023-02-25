#version 300 es

precision highp float;

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aVertexUV;

uniform mat4 uPMatrix;
uniform mat4 lightMVMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uObjMatrix;

uniform float spFlag;

out vec4 vPos;
out vec2 vTexCoord;

void main()
{
	// adjustment for sprites
	vPos = vec4(aPos, 1.0);
	if (spFlag > 0.5) vPos.z = vPos.z - 0.1;
	// calculate position
	vPos = uPMatrix * lightMVMatrix * uMVMatrix * uObjMatrix * vPos;
	gl_Position = vPos; 
	vTexCoord = aVertexUV;
}