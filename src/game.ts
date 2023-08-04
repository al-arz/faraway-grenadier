import { Application, Sprite } from "pixi.js";
import { DEBUG } from "./config";
import { LOCATION_CONFIG } from "./configs/location_config";
import { GAME_EVENTS } from "./events";
import { GameLocation, WorldPos } from "./model/game_location";
import { Nade, NadeType } from "./model/nade";
import { NadeUI } from "./nade_ui";
import { GrenadeThrower } from "./systems/grenade_thrower";
import { LocationBuilder } from "./systems/location_builder";
import { EventBus } from "./utils";
import { LocationView } from "./views/location_view";

export class Game {
  app: Application

  location: GameLocation
  locationView: LocationView
  activeNades: Map<Nade, Sprite>

  constructor(app: Application) {
    this.app = app

    const locationBuilder = new LocationBuilder()
    this.location = locationBuilder.createLocation(LOCATION_CONFIG)

    const pc = this.location.getPlayableCharacter()
    if (pc) {
      this.createThrower(pc.position)
    }

    const nadeInventory: NadeType[] = [
      "frag",
      "he",
      "thermal",
    ]
    const nadeUI = new NadeUI(nadeInventory)

    this.activeNades = new Map()
    this.locationView = new LocationView(this.location)
    this.locationView.position.set(0, 600)


    this.app.ticker.add(() => {
      this.activeNades.forEach((sprite, nade) => {
        nade.update(this.app.ticker.deltaMS)
        this.locationView.updateNadeSprite(sprite, nade)
      })
    })

    EventBus.on(GAME_EVENTS.NADE_LAUNCHED, (n: Nade) => {
      const nadeSprite = this.locationView.createNadeSprite(n)
      this.activeNades.set(n, nadeSprite)
    })
    EventBus.on(GAME_EVENTS.NADE_EXPLODED, this.onNadeExplosion.bind(this))
    EventBus.on(GAME_EVENTS.CHARACTER_DIED, (_) => {
      this.gameOver()
    })


    this.app.stage.addChild(this.locationView)
    this.app.stage.addChild(nadeUI)

    if (DEBUG) {
      this._setupDebugFeatures()
    }
  }

  createThrower(pos: WorldPos) {
    const thrower = new GrenadeThrower(pos)

    this.app.ticker.add(() => {
      thrower.update(this.app.ticker.deltaMS)
    })

    return thrower
  }

  onNadeExplosion(nade: Nade) {
    const nadeSprite = this.activeNades.get(nade)
    if (nadeSprite) {
      this.locationView.explode(nadeSprite, nade.position)
    }
    this.activeNades.delete(nade)
    this.location.processExplosion(nade)
  }

  gameOver() {
    alert("Game over")
  }

  // For pixi-inspector (https://github.com/bfanger/pixi-inspector) to work
  private _setupDebugFeatures() {
    globalThis.__PIXI_APP__ = this.app
  }
}
