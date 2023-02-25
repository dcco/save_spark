#version 300 es

precision mediump float;

out vec4 FragColor;

in vec2 xTexCoord;
in vec3 xPos;

uniform sampler2D gPos;
uniform sampler2D gNormal;
uniform sampler2D gColor;
uniform sampler2D gSpec;
uniform sampler2D occlusion;

uniform float noiseFlag;
uniform float noiseSeed;

const vec4 cDarkColor = vec4(0.7, 0.7, 0.8, 1.0);
const vec3 cFogColor = vec3(0.4, 0.45, 0.6);

const vec3 cLightPos = vec3(-9.0, -5.0, -25.0);
const vec3 cDiffColor = vec3(0.3, 0.3, 0.3);
const vec3 cSpecColor = vec3(0.4, 0.3, 0.5);

const vec3 centerPos = vec3(0.0, -1.0, -10.0);

const float ox = 1.0 / 800.0;
const float oy = 1.0 / 600.0;

	// math functions

vec3 squareVec(vec3 v) {
	return vec3(v.r * v.r, v.g * v.g, v.b * v.b);
}

vec3 sqrtVec(vec3 v) {
	return vec3(sqrt(v.r), sqrt(v.g), sqrt(v.b));
}

	// noise functions

uint hashFn( uint x ) {
	x += ( x << 10u );
	x ^= ( x >>  6u );
	x += ( x <<  3u );
	x ^= ( x >> 11u );
	x += ( x << 15u );
	return x;
}

float floatConstruct( uint m ) {
	const uint ieeeMantissa = 0x007FFFFFu;
	const uint ieeeOne = 0x3F800000u;

	m &= ieeeMantissa;
	m |= ieeeOne;

	float f = uintBitsToFloat( m );
	return f - 1.0;
}

float randVec3(vec3 v) {
	uint i = floatBitsToUint(v.r) ^ floatBitsToUint(v.g) ^ floatBitsToUint(v.b);
	return floatConstruct(hashFn(i));
}

void main(void) {

	vec3 vPos = texture(gPos, xTexCoord).rgb;
	vec3 vNormal = texture(gNormal, xTexCoord).rgb;
	vec4 vColor = texture(gColor, xTexCoord);
	vec4 vSpec = texture(gSpec, xTexCoord);
	float vOcc = texture(occlusion, xTexCoord).r;

	if (vColor.a <= 0.0) vOcc = 1.0;

	float distance = length(centerPos - vPos);
	float attenuation = 1.0 / (1.0 + 0.3 * pow(distance, 1.7));
	vColor = vColor + (vColor * attenuation * 0.8);

	// noise
	if (noiseFlag > 0.5) {
		float f = randVec3(vec3(vPos.xy, noiseSeed));
		float noiseDist = noiseFlag * 0.3;
		float noiseAdj = (1.0 - noiseDist + (f * noiseDist));
		vColor = vec4(vColor.r * noiseAdj, vColor.g * noiseAdj * 0.9, vColor.r * noiseAdj * 0.9, vColor.a);
	}

	// calculate shadow by averaging locations nearby
	float shadow = 0.0;
	for (int i = -1; i <= 1; i++)
	{
		for (int j = -2; j <= 0; j++)
		{
			float zx = xTexCoord.x + (ox * float(i));
			float zy = xTexCoord.y + (oy * float(i));
			float shadowP = texture(gSpec, vec2(zx, zy)).g;
			shadow = shadow + shadowP;
		}
	}
	shadow = (shadow * 0.4) / 9.0;

	vec3 lightDir = normalize(cLightPos - vPos);
	float lambert = dot(vNormal, lightDir);

	// Calculate the specular reflection
	float spec = 0.0;
	if (lambert > 0.0)
	{
		vec3 viewDir = normalize(-vPos);
		vec3 halfDir = normalize(lightDir + viewDir);
		float specAngle = dot(halfDir, vNormal);
		spec = pow(specAngle, 4.0);
	}

	// Combine the ambient, diffuse, and specular light to get the base color
	// (We're using the coloring given as the ambient light value)
	float alpha = vColor.a;
	vec4 texColor = vColor * cDarkColor;
	texColor = vec4(vOcc * (1.0 - shadow) * texColor.rgb, texColor.a);
	// lambert multiplier makes things lighter
	vec4 lightColor = vec4((lambert * 0.3 * cDiffColor) + (spec * 0.5 * cSpecColor), alpha);
	vec4 baseColor = texColor + (lightColor * 0.7);

	// fog factor
	float LOG2 = 1.442695;
	float fogCoord = vSpec.z - 3.0;

	float fogDensity = 0.07;
	float fogFactor = exp2(-fogDensity * fogDensity * fogCoord * fogCoord * LOG2);
	fogFactor = clamp(fogFactor, 0.0, 1.0);
	vec4 fogColor = mix(vec4(cFogColor, 1.0), baseColor, fogFactor);

	FragColor = fogColor;
}