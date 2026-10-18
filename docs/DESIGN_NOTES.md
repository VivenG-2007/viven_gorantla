# Architectural & Design Notes — Obsidian Signal Lab

## Inspiration Synthesis & Deliberate Divergences

1. **Razorpay AI Builders (`razorpay.com/ai-builders`)**
   - *Inspiration Borrowed*: High-velocity builder narrative; clear Problem → Approach → Architecture → Verification flow; typography that foregrounds real engineering decisions over decorative buzzwords.
   - *Deliberate Divergence*: Rather than a corporate brand aesthetic, this portfolio adopts the "Obsidian Signal Lab" visual system — dark, reflective materials (obsidian glass, brushed chrome, rim lighting in violet and cyan), customized specifically for an ambitious student engineer.

2. **Hardik Bhansali (`hardikbhansali.com`)**
   - *Inspiration Borrowed*: Seamless scroll-driven storytelling; tactile integration between 3D canvas objects and DOM editorial typography; cinematic atmosphere with restrained camera motion.
   - *Deliberate Divergence*: All 3D meshes and shaders are 100% procedural (liquid chrome FBM, vinyl anisotropic sheen disc, GPU particle dust), eliminating multi-megabyte GLB downloads and ensuring instant initial paint without third-party asset latency.

3. **ToyFight (`toyfight.co`)**
   - *Inspiration Borrowed*: Playful micro-interactions, bold typography, tactile cursor reactions, and a dedicated modal Command Deck (`/`).
   - *Deliberate Divergence*: No novelty or satirical gimmicks; all interactions emphasize engineering precision, verified proofs (certificates and hackathon trophies), and deep architectural clarity.

## Non-Negotiable Technical Constraints

- **No Tailwind CSS**: Built with native SCSS Modules and `@use "abstracts" as *;`.
- **Single WebGL Context**: One `<GlCanvas>` with R3F `<View.Port>` to prevent GPU memory leaks.
- **Truthful Copy**: Strictly no inflated job titles or unverified rankings; AWS entries labelled as "Training completed", DECODEX labelled as "Certificate of Merit", and student roll numbers masked.
