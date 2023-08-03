import { ResolverManifest } from "pixi.js"

export const manifest: ResolverManifest = {
  bundles: [
    {
      name: "ground",
      assets: {
        "tiles": "./assets/ground/ground.json"
      }
    },
    {
      name: "nades",
      assets: {
        "nades": "./assets/nades/nades.json"
      }
    },
    {
      name: "chars",
      assets: {
        "chars": "./assets/chars/chars.json"
      }
    },
    {
      name: "fx",
      assets: {
        "fx": "./assets/fx/fx.json"
      }
    },
  ]
}
