export const liquidChromeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const liquidChromeFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uPointer;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    vec2 m = uMouse;
    m.x *= uAspect;

    float t = uTime * 0.04;
    vec2 q = vec2(fbm(uv * 1.6 + t), fbm(uv * 1.6 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(uv * 1.6 + 3.0 * q + vec2(1.7, 9.2) + t * 1.5), fbm(uv * 1.6 + 3.0 * q + vec2(8.3, 2.8) - t));
    float f = fbm(uv * 1.6 + 3.0 * r);

    f += smoothstep(0.6, 0.0, distance(uv, m)) * 0.25 * uPointer;

    vec3 base   = vec3(0.020, 0.024, 0.032);
    vec3 silver = vec3(0.72, 0.74, 0.78);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 cyan   = vec3(0.133, 0.827, 0.933);

    float ridge = smoothstep(0.45, 0.55, f) * smoothstep(0.75, 0.55, f);
    vec3 col = base + silver * pow(f, 3.0) * 0.35 * (1.0 - uScroll * 0.6);
    col += mix(violet, cyan, r.x) * ridge * 0.35;
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.025; // Subtle grain

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
