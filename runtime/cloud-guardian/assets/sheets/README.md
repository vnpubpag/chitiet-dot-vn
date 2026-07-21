# Art drop-in folder

Place production spritesheet PNGs here, named exactly as declared in
`src/assets/manifest.ts` (e.g. `cloud.png`, `gloomy-puff.png`).

- Any sheet **missing** from this folder is replaced at runtime by a generated
  placeholder — the game always runs.
- Frame sizes and grid layouts are a hard contract: see
  [doc/design/asset-spec.md](../../../doc/design/asset-spec.md) for the full
  per-sheet spec and [doc/design/art-style-guide.md](../../../doc/design/art-style-guide.md)
  for the shared style.
