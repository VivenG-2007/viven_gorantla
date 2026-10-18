export const portalVertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uVelocity;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Velocity-based micro vertical bend
    pos.z += sin(uv.x * 3.14159) * uVelocity * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const portalFragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImg;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uTime;

  vec2 coverUv(vec2 uv, vec2 plane, vec2 img) {
    float pr = plane.x / plane.y;
    float ir = img.x / img.y;
    vec2 s = pr > ir ? vec2(1.0, ir / pr) : vec2(pr / ir, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlane, uImg);
    vec2 d = vUv - uMouse;
    float dist = length(d);

    // Dynamic ripple
    float ripple = smoothstep(0.35, 0.0, dist) * uHover;
    vec2 off = normalize(d + 1e-4) * ripple * 0.03 * (1.0 + abs(uVelocity));
    off.y += uVelocity * 0.02 * sin(vUv.x * 6.2831 + uTime);

    // Chromatic RGB split driven by scroll velocity & hover
    float split = (0.003 + abs(uVelocity) * 0.008) * (0.5 + uHover);
    vec3 col = vec3(
      texture2D(uTex, uv + off + vec2(split, 0.0)).r,
      texture2D(uTex, uv + off).g,
      texture2D(uTex, uv + off - vec2(split, 0.0)).b
    );

    // Subtle duotone transition to full vibrant color on hover
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 duo = mix(vec3(0.02, 0.024, 0.03), vec3(0.545, 0.361, 0.965), l);
    col = mix(duo, col, 0.25 + uHover * 0.75);
    col *= mix(0.7, 1.0, smoothstep(0.9, 0.3, length(vUv - 0.5)));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
