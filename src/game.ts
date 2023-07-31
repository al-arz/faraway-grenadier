import { Application } from "pixi.js";
import { DEBUG } from "./config";
import { PALETTE } from "./palette";

export class Game {
  canvas: HTMLCanvasElement
  app: Application

  constructor() {
    this.canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement
    this.app = new Application({
      view: this.canvas,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: PALETTE.GRAY,
      resizeTo: window
    })

    if (DEBUG) {
      this._setupDebugFeatures()
    }
  }

  // For pixi-inspector (https://github.com/bfanger/pixi-inspector) to work
  private _setupDebugFeatures() {
    globalThis.__PIXI_APP__ = this.app
  }
}
