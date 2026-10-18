# Missing Assets / Optional Uploads

As specified in the build brief, the following assets were not supplied and have NOT been fabricated or hotlinked:

1. **GCET Hive Platform Screenshot**
   - *Status:* Intentionally replaced with a high-contrast typographic diagnostic metric card (`273` problems in C, `488` submissions, Nov 2025 – Oct 2026 snapshot).
   - *Action for Viven:* If you wish to provide a screenshot, ensure your student ID is masked before uploading to `public/images/coding/gcet-hive-masked.png`.

2. **Resume PDF**
   - *Status:* Gracefully omitted from the public CTA unless `NEXT_PUBLIC_RESUME_URL` is defined in `.env.local`.
   - *Action for Viven:* Add `resume.pdf` to `public/` and configure `NEXT_PUBLIC_RESUME_URL=/resume.pdf`.

3. **External Concept / Mood Art**
   - *Status:* The hero scene and project portals utilize 100% procedural WebGL / GLSL shaders (`liquidChrome`, `signalDisc`, `portal`, `ParticleField`), eliminating external 3D asset dependencies.
