#version 300 es

precision highp float;

layout (location = 0) in vec2 aVertexUV;
layout (location = 1) in vec3 aVertexPosition;
layout (location = 2) in vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uObjMatrix;

uniform mat4 lightPMatrix;
uniform mat4 lightMVMatrix;

out vec3 vNormInterp;
out vec3 vPos;
out vec2 vTexCoord;

out vec4 fragLightPos;

void main(void) {
	// Set the vertex position / get position in terms of shadow light
	vec4 oPos4 = uObjMatrix * vec4(aVertexPosition, 1.0);
	//vec4 oPos4 = uMVMatrix * vec4(aVertexPosition, 1.0);
	fragLightPos = lightPMatrix * lightMVMatrix * uMVMatrix * oPos4;
	vec4 vPos4 = uMVMatrix * oPos4;
	gl_Position = uPMatrix * vPos4;

	// Pass the vertex position to the fragment shader
	vPos = vPos4.xyz;

	// Pass on the vertex normals for interpolation in the fragment shader
	//mat3 normMatrix = transpose(inverse(mat3(uMVMatrix * uObjMatrix)));
	mat3 normMatrix = transpose(inverse(mat3(uMVMatrix * uObjMatrix)));
	vNormInterp = normMatrix * aVertexNormal;

	// pass in the texture coordinate
	vTexCoord = aVertexUV;
}