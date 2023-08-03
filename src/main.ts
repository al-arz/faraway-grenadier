import { Assets } from "pixi.js";
import { Game } from "./game";
import { manifest } from "./manifest";

async function loadAssets(): Promise<void> {
  console.log("loading assets")
  await Assets.init({ manifest: manifest });
  const bundleIds = manifest.bundles.map(bundle => bundle.name);
  await Assets.loadBundle(bundleIds);
  console.log("assets loaded", Assets.cache)
}

loadAssets().then(() => {
  new Game()
})
