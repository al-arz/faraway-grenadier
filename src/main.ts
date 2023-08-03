import { Assets, BaseTexture, SCALE_MODES } from "pixi.js";
import { Game } from "./game";
import { manifest } from "./manifest";


async function loadAssets(): Promise<void> {
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
  console.log("loading assets")
  await Assets.init({ manifest: manifest });
  const bundleIds = manifest.bundles.map(bundle => bundle.name);
  await Assets.loadBundle(bundleIds);
  console.log("assets loaded", Assets.cache)
}

loadAssets().then(() => {
  new Game()
})
