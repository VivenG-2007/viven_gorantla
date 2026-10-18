export const signalDiscVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const signalDiscFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec3 uViolet;
  uniform vec3 uCyan;

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);

    // Micro-grooves on vinyl disc
    float grooves = 0.5 + 0.5 * sin(r * 380.0);
    float face = smoothstep(0.17, 0.19, r) * (1.0 - smoothstep(0.97, 1.0, r));

    // Anisotropic conic sheens
    float sheenA = pow(max(0.0, sin(a * 2.0 + uPointer.x * 2.5 + uTime * 0.15)), 10.0);
    float sheenB = pow(max(0.0, sin(a * 2.0 + 3.14159 + uPointer.y * 2.5 - uTime * 0.12)), 14.0);

    vec3 col = vec3(0.035, 0.040, 0.050) + grooves * 0.035;
    col += vec3(0.78, 0.80, 0.85) * sheenA * 0.55 * face + uViolet * sheenB * 0.5 * face;
    col += uCyan * smoothstep(0.9, 0.99, r) * (1.0 - smoothstep(0.99, 1.0, r)) * 0.6;
    col *= face + 0.08;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
