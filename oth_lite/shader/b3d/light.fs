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
uniform sampler2D blur;

uniform float uGlow;
// 0 - normal, 1 - sepia, 2 - green, 3 - purple, 4 - rainbow
uniform float tintFlag;
// 0 - normal, 1 - dim, 2 - fog, 3 - special, 2.1 - light fog
uniform float lightFlag;
uniform float bloomFlag;
uniform float fragmentFlag;
uniform float wtfFlag;
uniform float noiseFlag;

// supports rainbow tint flag
uniform float xFlag;
// supports noise flag
uniform float noiseSeed;

const vec4 cDarkColor = vec4(0.7, 0.7, 0.8, 1.0);
//const vec3 cFogColor = vec3(0.4, 0.4, 0.5);
//const vec3 cFogColor = vec3(0.6, 0.45, 0.4);
const vec3 cFogColor = vec3(0.4, 0.15, 0.1);
const vec3 cFLColor = vec3(0.7, 0.44, 0.4);
const vec3 cAAColor = vec3(0.53, 0.43, 0.43);

//const vec3 cLightPos = vec3(-0.5, 4.0, -2.0);
//const vec3 cLightPos = vec3(-10.0, -10.0, 5.0);
const vec3 cLightPos = vec3(-9.0, -5.0, -25.0);
const vec3 cDiffColor = vec3(0.3, 0.3, 0.3);
const vec3 cSpecColor = vec3(0.4, 0.3, 0.5);

const vec3 centerPos = vec3(0.0, 0.0, -10.0);

const float ox = 1.0 / 800.0;
const float oy = 1.0 / 600.0;

vec3 squareVec(vec3 v) {
	return vec3(v.r * v.r, v.g * v.g, v.b * v.b);
}

vec3 sqrtVec(vec3 v) {
	return vec3(sqrt(v.r), sqrt(v.g), sqrt(v.b));
}

vec3 hueShift(vec3 color, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

vec4 shiftColor(vec4 v, vec3 vPos, float back) {
	// wtf
	if (tintFlag > 4.5) {
		return vec4(v.r * 0.35, v.g * 0.45, v.b * 0.2, v.a);
	// rainbow
	} else if (tintFlag > 3.5) {
		int s = int(floor((vPos.x + vPos.y + vPos.z + xFlag)) * 5.0) % 256;
		s = s / 4;
		float z = radians(float(s) * 360.0 / 64.0);
		vec3 vx = vec3(v.r, v.g * 0.7, v.b * 0.8);
		return vec4(hueShift(vx, z), 1.0);
	// purple
	} else if (tintFlag > 2.5) {
		float vx = (v.r * 0.25) + (v.g * 0.35) + (v.b * 0.25) + 0.15;
		return vec4((0.5 * vx) + (0.2 * v.r) + 0.05, (0.3 * vx) + 0.05, (0.4 * vx) + (0.5 * v.b) + 0.1, v.a);
	// green
	} else if (tintFlag > 1.5) {
		float vx = (v.r * 0.25) + (v.g * 0.35) + (v.b * 0.25);
		return vec4(0.3 * (vx + 0.15), vx + 0.15, 0.4 * vx, v.a);
	// sepia
	} else if (tintFlag > 0.5) {
		float vx = (v.r * 0.25) + (v.g * 0.35) + (v.b * 0.25);
		return vec4(0.9 * vx, 0.8 * vx, 0.6 * vx, v.a);
	}
	return v;
}

vec4 specMix(vec4 v, vec3 vr, vec3 vb) {
	float r = sqrt(((v.r * v.r) + (vr.r * vr.r)) / 2.0);
	float b = sqrt(((v.b * v.b) + (vb.b * vb.b)) / 2.0);
	return vec4(r, v.g, b, v.a);
}

vec4 dimColor(vec4 v, vec2 texCoord) {
	if (lightFlag > 0.5 && lightFlag < 1.5) {
		float d2x = (0.5 - texCoord.x) * 2.0;
		float d2y = (0.5 - texCoord.y) * 2.0;
		float d2 = sqrt((d2x * d2x) + (d2y * d2y)) * 3.0;
		float a2 = 1.0 / (1.0 + 1.8 * pow(d2, 1.8));
		return vec4(v.r * a2, v.g * a2 * 1.2, v.b * a2 * 1.8, v.a);
	}
	return v;
}

vec4 fogColor(vec4 v, vec4 vSpec, float attenuation, float back) {
	if (lightFlag > 1.5 && lightFlag < 2.5) {
		float LOG2 = 1.442695;
		float fogCoord = vSpec.z - 4.0;
		// fog density at 0.09 for darker rooms
		//float fogDensity = 0.05;
		float fogDensity = 0.3;
		if (back > 0.5) fogDensity = 0.013;
		else if (lightFlag > 2.05 && lightFlag < 2.15) {
			fogDensity = 0.2;
		}
		float fogFactor = exp2(-fogDensity * fogDensity * fogCoord * fogCoord * LOG2);
		fogFactor = fogFactor + (sqrt(attenuation) * 0.7);
		fogFactor = clamp(fogFactor, 0.0, 1.0);
		vec3 xFogColor = cFogColor;
		if (lightFlag > 2.05 && lightFlag < 2.15) { xFogColor = cFLColor; }
		return mix(vec4(xFogColor, 1.0), v, fogFactor);
	}
	return v;
}

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

vec2 rescaleCoord(vec2 oldCoord) {
	//return oldCoord * 2.0;
	vec2 newCoord = (oldCoord * 2.0) - 0.5;
	float offsetX = floor(newCoord.x);
	float offsetY = floor(newCoord.y);
	return vec2(newCoord.x - offsetX, newCoord.y - offsetY);
}

void main(void) {
	vec2 fTexCoord = xTexCoord;
	if (wtfFlag > 0.5) { fTexCoord = rescaleCoord(fTexCoord); }

	vec3 vPos = texture(gPos, fTexCoord).rgb;
	vec3 vNormal = texture(gNormal, fTexCoord).rgb;

	vec4 vColor = texture(gColor, fTexCoord);

	vec4 vSpec = texture(gSpec, fTexCoord);
	float vOcc = texture(occlusion, fTexCoord).r;
	vec4 bloomColor = texture(blur, fTexCoord);

	float bright = 0.0;
	float back = 0.0;
	if (vSpec.r > 1.5) bright = 1.0;
	else if (vSpec.r > 0.5) back = 1.0;

	if (vColor.a <= 0.0) vOcc = 1.0;

	// noise
	if (noiseFlag > 0.5) {
		float f = randVec3(vec3(vPos.xy, noiseSeed));
		float noiseDist = noiseFlag * 0.3;
		vColor = vec4(vColor.rgb * (1.0 - noiseDist + (f * noiseDist)), vColor.a);
	}

	//float distance = length(diffLightPos - vPos);
	//float attenuation = 1.0 / (1.0 + 0.2 * pow(distance, 4.0));
	//vColor = vColor + (vColor * attenuation * 1.3);
	float distance = length(centerPos - vPos);
	float attenuation = 1.0 / (1.0 + 0.3 * pow(distance, 2.0));
	if (lightFlag < 2.5) {
		vColor = vColor + (vColor * attenuation);
	}

	// calculate bloom color
	float bloomFactor = bloomColor.a * 0.3;
	if (back == 1.0) bloomColor = bloomColor * 0.5;
	float bloomBoost = uGlow * uGlow * 69.0;
	if (bloomFlag > 0.5) bloomBoost = bloomBoost + 0.3;
	vColor = (vColor * (1.0 - bloomFactor)) + (bloomColor * (0.9 + bloomBoost));

	vColor = shiftColor(vColor, vPos, back);
	if (fragmentFlag > 0.5) {
		vec3 vColorA = texture(gColor, vec2(xTexCoord.x - 0.007, xTexCoord.y)).rgb;
		vec3 vColorB = texture(gColor, vec2(xTexCoord.x + 0.007, xTexCoord.y)).rgb;
		vColor = specMix(vColor, vColorA, vColorB);
	}
	
	//vColor.r = vColor.r * 0.95;
	//vColor.g = vColor.g * 0.85;
	//vColor.b = vColor.b * 0.75;
	
	//vColor.r = vColor.r * 0.95;
	//vColor.g = vColor.g * 0.65;
	//vColor.b = vColor.b * 0.75;

	if (back == 1.0 && wtfFlag < 0.5) {
		if (lightFlag > 2.5 && lightFlag < 3.5) {
			vec4 atColor = vec4(cAAColor, 1.0);
			atColor = atColor + (bloomColor * bloomBoost);
			FragColor = atColor;
			return;
		}
		vColor = dimColor(vColor, fTexCoord);
		vColor.r = sqrt(vColor.r * vColor.r * 0.95);
		vColor.g = sqrt(vColor.g * vColor.r * 0.8);
		vColor.b = sqrt(vColor.b * vColor.r * 0.6);
		vColor = fogColor(vColor, vSpec, attenuation, 1.0);
		FragColor = vColor;
		return;
	} /* else if (back == 1.0) {
		vec4 v = vColor;
		float vx = (v.r * 0.25) + (v.g * 0.35) + (v.b * 0.25);
		vColor = vec4(0.8 * vx, (0.6 * vx) + (v.g * 0.35), 0.6 * vx, v.a);
	} */

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
	if (wtfFlag > 0.5) { shadow = 0.0; }

	float attenLow = 1.0 / (1.0 + 0.8 * pow(distance, 1.4));
	if (lightFlag > 2.5 && lightFlag < 3.5) {
		float f = attenLow * shadow;
		vColor = (vColor * f) + (bloomColor * bloomBoost);
	}

	//if (lightFlag > 2.5 && lightFlag < 3.5) {

	//float shadow = texture(gSpec, xTexCoord).g * 0.4;

	//vColor = vColor * attenuation * shadow;

	// Using the normal vectors and the light direction, calculation the light intensity at the fragment
	//vec3 norm = texture(gNormal, vTexCoord);

	vec3 lightDir = normalize(cLightPos - vPos);
	float lambert = dot(vNormal, lightDir);

	// Calculate the specular reflection
	float spec = 0.0;
	if (bright == 1.0)
	{
		spec = 1.0;
		lambert = 4.0;
	}
	else if (lambert > 0.0)
	{
		vec3 viewDir = normalize(-vPos);
		vec3 halfDir = normalize(lightDir + viewDir);
		float specAngle = dot(halfDir, vNormal);
		spec = pow(specAngle, 4.0);
	}

	//vec4 vColor = vec4(0.3, 0.2, 0.2, 1.0);
	//vec4 vColor = texture(uSampler, vTexCoord);

	// Combine the ambient, diffuse, and specular light to get the base color
	// (We're using the coloring given as the ambient light value)
	float alpha = vColor.a;
	//float shadow = vSpec.g * 0.4;
	vec4 texColor = vColor * cDarkColor;
	texColor = vec4(vOcc * (1.0 - shadow) * texColor.rgb, texColor.a);
	//texColor = vec4(vOcc * texColor.rgb, texColor.a);
	//texColor = vec4(vOcc * cOneColor, texColor.a);
	// lambert multiplier makes things lighter
	vec4 lightColor = vec4((lambert * 0.3 * cDiffColor) + (spec * cSpecColor), alpha);
	vec4 baseColor = texColor + (lightColor * 0.7);

	baseColor = dimColor(baseColor, fTexCoord);

	/*float fogCoord = vSpec.z - 4.0;
	// fog density at 0.09 for darker rooms
	//float fogDensity = 0.05;
	float fogDensity = 2.0;
	float fogFactor = exp2(-fogDensity * fogDensity * fogCoord * fogCoord * LOG2);
	fogFactor = clamp(fogFactor, 0.0, 1.0);
	vec4 fogColor = mix(vec4(cFogColor, 1.0), baseColor, fogFactor);*/
	vec4 fogColor = fogColor(baseColor, vSpec, attenuation, 0.0);

	if (lightFlag > 2.5 && lightFlag < 3.5) {
		//fogColor = vec4(cAAColor, 1.0 - affen) + fogColor;
		float f = fogColor.a;
		float ir = fogColor.r;
		float ig = fogColor.g;
		float ib = fogColor.b;
		fogColor = vec4((cAAColor.r * (1.0 - f)) + (ir * f),
			(cAAColor.g * (1.0 - f)) + (ig * f), (cAAColor.b * (1.0 - f)) + (ib * f), 1.0);
		//fogColor = vec4((cAAColor.r * (1.0 - f)) + (fogColor.r * f),
		//	(cAAColor.g * (1.0 - f)) + (fogColor.g * f), (cAAColor.b * (1.0 - f)) + (fogColor.b * f), 1.0);
	}

	//FragColor = vec4(vOcc * cDarkColor.rgb, vColor.a) + (vec4(cFogColor, 0.0) * 0.0);
	FragColor = fogColor;
	//FragColor = fogColor;
	//FragColor = texture(occlusion, xTexCoord);
}