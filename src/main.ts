import { Application, Assets, BaseTexture, SCALE_MODES } from "pixi.js";
import { Game } from "./game";
import { manifest } from "./manifest";
import { PALETTE } from "./palette";

loadAssets().then(initGame)

async function loadAssets(): Promise<void> {
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
  await Assets.init({ manifest: manifest });
  const bundleIds = manifest.bundles.map(bundle => bundle.name);
  await Assets.loadBundle(bundleIds);
}

function initGame() {
  const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement
  const app = new Application({
    view: canvas,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: PALETTE.LIGHTGRAY,
    resizeTo: window
  })

  new Game(app)
}
