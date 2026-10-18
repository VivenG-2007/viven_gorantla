export const particlePortraitVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScatterRadius;
  uniform float uScatterStrength;
  uniform float uScrollProgress;
  uniform float uBaseSize;
  uniform float uDpr;
  uniform float uWaveSpeed;

  attribute vec3 aOrigin;
  attribute vec3 aColor;
  attribute vec4 aParams; // x: goldFactor, y: shimmerSpeed, z: sizeMult, w: randomPhase

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGoldFactor;

  void main() {
    vec3 pos = aOrigin;

    // 1. Organic volumetric micro-oscillation (breathing / floating)
    float t = uTime * 0.9;
    float phase = aParams.w * 6.28318;
    pos.x += sin(t * 1.1 + phase) * 0.018;
    pos.y += cos(t * 0.95 + phase * 1.3) * 0.022;
    pos.z += sin(t * 1.25 + phase * 0.7) * 0.024;

    // 2. Mouse cursor scatter & dynamic repulsion
    // uPointer is in world units corresponding to particle space
    vec2 toMouse = pos.xy - uPointer;
    float dist = length(toMouse);

    if (dist < uScatterRadius && uScatterRadius > 0.001) {
      float normDist = dist / uScatterRadius;
      float force = pow(1.0 - normDist, 2.2);
      vec2 dir = normalize(toMouse + vec2(0.0001));

      // Scatter outward in XY and forward/backward in Z for volumetric burst
      pos.xy += dir * force * uScatterStrength;
      pos.z += force * 0.28 * sin(phase);
    }

    // 3. Scroll reactive displacement (depth translation and vertical drift)
    pos.y += uScrollProgress * 1.25;
    pos.z -= uScrollProgress * 1.8;

    // 4. Traveling restrained golden pulse wave across the face / silhouette
    // Wave moves along diagonal y + 0.35 * x
    float wavePos = mod(uTime * uWaveSpeed, 4.5) - 2.0;
    float waveCoord = pos.y + pos.x * 0.35;
    float waveDist = abs(waveCoord - wavePos);
    float waveIntensity = smoothstep(0.4, 0.0, waveDist) * 0.75;

    // Slight volumetric lift during wave
    pos.z += waveIntensity * 0.06;

    // Color mixing: silver/grayscale face + gold rim + traveling wave
    vec3 goldColor = vec3(1.0, 0.76, 0.28);
    vec3 amberColor = vec3(0.95, 0.62, 0.18);
    vec3 mixedGold = mix(goldColor, amberColor, sin(phase + uTime) * 0.5 + 0.5);

    // aParams.x is goldFactor (0 on inner face, 1 on hair edges/shoulders/halo)
    float effectiveGold = clamp(aParams.x + waveIntensity * (1.0 - aParams.x * 0.5), 0.0, 1.0);
    vColor = mix(aColor, mixedGold, effectiveGold);
    vGoldFactor = effectiveGold;

    // Shimmer effect (brightness / alpha pulsation)
    float shimmer = 0.82 + 0.25 * sin(uTime * (2.0 + aParams.y * 3.0) + phase * 4.0);
    float scrollAlpha = clamp(1.0 - uScrollProgress * 1.8, 0.0, 1.0);
    vAlpha = shimmer * scrollAlpha;

    // Projection calculation
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size calculation with perspective attenuation & DPR scaling
    float sizePulse = 1.0 + 0.2 * sin(uTime * 2.5 * aParams.y + phase);
    float pSize = uBaseSize * aParams.z * sizePulse * uDpr;
    gl_PointSize = clamp(pSize * (190.0 / -mvPosition.z), 1.5, 9.5);
  }
`;

export const particlePortraitFragment = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGoldFactor;

  void main() {
    // Render high quality anti-aliased soft circular points
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Soft feathered edge falloff
    float radial = smoothstep(0.5, 0.12, dist);

    // Warm luminous center core
    float core = smoothstep(0.2, 0.0, dist) * 0.35 * vGoldFactor;
    vec3 col = vColor + vec3(core);

    gl_FragColor = vec4(col, radial * vAlpha * uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
