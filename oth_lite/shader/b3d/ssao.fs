#version 300 es

precision mediump float;

out vec4 FragColor;

in vec2 xTexCoord;

uniform sampler2D gPos;
uniform sampler2D gNormal;
uniform sampler2D texNoise;

uniform vec3 samples[64];

int kernelSize = 64;
float radius = 0.3;
float bias = 0.4;

const vec2 noiseScale = vec2(800.0 / 4.0, 600.0 / 4.0); 

uniform mat4 uPMatrix;

void main()
{
	// SSAO inputs
	vec4 vPosX = texture(gPos, xTexCoord);
	vec3 vPos = vPosX.rgb;
	vec3 vNormal = normalize(texture(gNormal, xTexCoord).rgb);
	vec3 randomVec = normalize(texture(texNoise, xTexCoord * noiseScale).rgb);

	// TBN change of basis matrix
	vec3 tan = normalize(randomVec - (vNormal * dot(randomVec, vNormal)));
	vec3 bitan = cross(vNormal, tan);
	mat3 tbnMat = mat3(tan, bitan, vNormal);

	// sample kernel iteration to calculate occlusion
	float occlusion = 0.0;
	for (int i = 0; i < kernelSize; i++)
	{
		// from the point, calculate a sample point
		vec3 samplePos = tbnMat * samples[i];
		samplePos = vPos + (samplePos * radius);
			
		// calculate the sample point back into view space, and then into a 0.0-1.0 range
		vec4 offset = vec4(samplePos, 1.0);
		offset = uPMatrix * offset;
		offset.xyz = ((offset.xyz / offset.w) * 0.5) + 0.5;
		
		// at the given xy coordinate, calculate the depth
		float sampleDepth = texture(gPos, offset.xy).z;
		
		// if the depth > original pos by a certain amount, add to the occlusion
		float rangeCheck = smoothstep(0.0, 1.0, radius / abs(vPos.z - sampleDepth));
		float sampleEx = (sampleDepth >= samplePos.z + bias ? 1.0 : 0.0);
		occlusion = occlusion + (sampleEx * rangeCheck);
	}
	occlusion = 1.0 - (occlusion / float(kernelSize));
	//occlusion = occlusion * occlusion;

	FragColor = vec4(occlusion, 0.0, 0.0, 1.0);
}