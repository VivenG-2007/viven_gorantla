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

    // 1. Organic micro-breathing oscillation
    float t = uTime * 1.1;
    float phase = aParams.w * 6.28318;
    pos.x += sin(t * 0.95 + phase) * 0.016;
    pos.y += cos(t * 0.85 + phase * 1.2) * 0.018;
    pos.z += sin(t * 1.15 + phase * 0.8) * 0.020;

    // 2. Interactive mouse cursor repulsion
    vec2 toMouse = pos.xy - uPointer;
    float distMouse = length(toMouse);

    if (distMouse < uScatterRadius && uScatterRadius > 0.001) {
      float normDist = distMouse / uScatterRadius;
      float force = pow(1.0 - normDist, 2.0);
      vec2 dir = normalize(toMouse + vec2(0.0001));

      pos.xy += dir * force * uScatterStrength;
      pos.z += force * 0.35 * sin(phase);
    }

    // 3. Scroll reactive dynamic wave distortion
    // Reversible: exactly proportional to uScrollProgress (0.0 at top, 1.0 scrolled down)
    float s = clamp(uScrollProgress, 0.0, 1.0);

    if (s > 0.001) {
      // Harmonic traveling wave ripples across XY & Z axes
      float waveFreq = 4.2;
      float waveTime = uTime * 2.6;
      float wave1 = sin(pos.y * waveFreq + waveTime + s * 8.0) * cos(pos.x * 3.2 + waveTime * 0.8);
      float wave2 = cos(pos.y * 6.5 - waveTime * 1.2 + pos.x * 4.0 + phase);

      // Liquid wave lateral and vertical distortion
      pos.x += (wave1 * 0.55 + wave2 * 0.3) * s * 1.4;
      pos.y += (wave2 * 0.45 + wave1 * 0.35) * s * 1.2 + (s * 1.6); // Upward float

      // Volumetric wave depth displacement
      pos.z += (wave1 - wave2) * s * 2.0;

      // Dispersal / scatter outward as user scrolls deeper
      float disperseDist = pow(s, 1.7) * 2.4;
      vec2 disperseDir = normalize(pos.xy + vec2(0.0001));
      pos.xy += disperseDir * disperseDist;
    }

    // 4. Color palette: Golden / Orange theme
    vec3 brightGold = vec3(1.0, 0.84, 0.35); // Radiant Gold
    vec3 warmAmber = vec3(0.96, 0.62, 0.14);  // Warm Amber (#f59e0b)
    vec3 deepOrange = vec3(0.97, 0.45, 0.09); // Energetic Orange (#f97316)

    // Shimmer wave traveling across the face
    float pulsePos = mod(uTime * uWaveSpeed, 4.5) - 2.0;
    float pulseDist = abs((pos.y + pos.x * 0.3) - pulsePos);
    float waveLight = smoothstep(0.45, 0.0, pulseDist) * 0.8;

    // Blend between golden amber, orange rim, and bright silver/gold facial core
    vec3 goldMixed = mix(warmAmber, brightGold, sin(phase + uTime * 1.5) * 0.5 + 0.5);
    goldMixed = mix(goldMixed, deepOrange, aParams.x * 0.45);

    float effectiveGold = clamp(aParams.x + waveLight * (1.0 - aParams.x * 0.5), 0.0, 1.0);
    vColor = mix(aColor, goldMixed, effectiveGold);
    vGoldFactor = effectiveGold;

    // 5. Alpha calculation: fully visible at rest (s=0), dissolves to 0 as you scroll down
    float shimmer = 0.85 + 0.25 * sin(uTime * (1.8 + aParams.y * 2.5) + phase * 3.0);
    float scrollAlpha = clamp(1.0 - smoothstep(0.04, 0.82, s), 0.0, 1.0);
    vAlpha = shimmer * scrollAlpha;

    // 6. Project to screen
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 7. Point size with perspective scale & scroll dispersion size pulse
    float sizePulse = 1.0 + 0.22 * sin(uTime * 2.0 * aParams.y + phase);
    float pSize = uBaseSize * aParams.z * sizePulse * uDpr * (1.0 + s * 0.4);
    gl_PointSize = clamp(pSize * (195.0 / -mvPosition.z), 1.5, 9.5);
  }
`;

export const particlePortraitFragment = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vGoldFactor;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    // Soft anti-aliased circular particle edge
    float radial = smoothstep(0.5, 0.08, dist);

    // Warm luminous golden/orange core glow
    float core = smoothstep(0.22, 0.0, dist) * 0.45 * vGoldFactor;
    vec3 col = vColor + vec3(core * 1.0, core * 0.72, core * 0.18);

    gl_FragColor = vec4(col, radial * vAlpha * uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
