import { Application, ColorSource, Container, Graphics, Sprite } from "pixi.js";
import { DEBUG } from "./config";
import { LOCATION_CONFIG, LocationConfig, LocationObjectType } from "./configs/location_config";
import { GrenadeThrower } from "./creators/throw_controller";
import { GAME_EVENTS } from "./events";
import { GroundLayer } from "./ground_layer";
import { Character } from "./model/character";
import { GameLocation, LocationObject } from "./model/game_location";
import { Nade, NadeType } from "./model/nade";
import { Obstacle } from "./model/obstacle";
import { NADE_COLORS, NadeUI } from "./nade_ui";
import { PALETTE } from "./palette";
import { StatBar } from "./ui/statbar";
import { EventBus, getDisplayPos, quadFallof } from "./utils";

export class Game {
  canvas: HTMLCanvasElement
  app: Application

  activeNades: Map<Nade, Sprite>

  constructor() {
    this.canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement
    this.app = new Application({
      view: this.canvas,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: PALETTE.LIGHTGRAY,
      resizeTo: window
    })

    const location = this._createLocation(LOCATION_CONFIG)
    this._displayLocation(location)

    const pc = location.getPlayableCharacter()
    if (pc) {
      const thrower = new GrenadeThrower(pc.pos)

      EventBus.on(GAME_EVENTS.NADE_LAUNCHED, (n: Nade) => {
        this._launchNade(pc, n)
      })

      this.app.ticker.add(() => {
        thrower.update(this.app.ticker.deltaMS)
        for (const nade of this.activeNades.keys()) {
          nade.update(this.app.ticker.deltaMS)
        }
      })
    } else {
      console.warn("Location has no characters")
    }

    this.app.ticker.add(() => {
      this.activeNades.forEach((sprite, nade) => {
        const isoPos = getDisplayPos(nade.pos)
        sprite.position.set(isoPos.x, isoPos.y)
      })
    })

    EventBus.on(GAME_EVENTS.NADE_EXPLODED, (nade: Nade) => {
      const s = this.activeNades.get(nade)
      if (s) {
        this.app.stage.removeChild(s)
        this.activeNades.delete(nade)
      }
      for (const target of location.characters) {
        const dx = target.pos.x - nade.pos.x
        const dy = target.pos.y - nade.pos.y

        const dSq = Math.sqrt(dx * dx + dy * dy)
        const blastSq = nade.config.blastRadius
        console.log("dSq, blastRadiusSq", dSq, blastSq)
        if (dSq <= blastSq) {
          const falloff = quadFallof(2 * (dSq / blastSq), 2)
          const dmg = nade.config.damage * falloff;
          target.takeDamage(dmg)
          console.log(`hit ${target.type} at ${target.pos.x}, ${target.pos.y} for ${dmg} damage`)
          console.log(`percent of range ${dSq / blastSq}, falloff ${falloff}`)
        }
      }
    })

    this.activeNades = new Map()

    const nadeInventory: NadeType[] = [
      "frag",
      "he",
      "thermal",
    ]
    const nadeUI = new NadeUI(nadeInventory)

    this.app.stage.addChild(nadeUI)

    const enemy = location.getEnemy()
    if (enemy) {
      const enemyHPBar = new StatBar(100, 100)
      this.app.stage.addChild(enemyHPBar)
      enemyHPBar.update(enemy.hp)
      enemyHPBar.position.set(enemy.pos.x, enemy.pos.y)

      EventBus.on(GAME_EVENTS.CHARACTER_HIT, (character: Character, damage: number) => {
        enemyHPBar.update(character.hp)
      })

      EventBus.on(GAME_EVENTS.CHARACTER_DIED, (character: Character) => {
        this._gameOver()
      })
    }


    if (DEBUG) {
      this._setupDebugFeatures()
    }
  }

  private _gameOver() {
    alert("Game over")
  }

  private _launchNade(thrower: LocationObject, nade: Nade) {

    const nadeSprite = new Sprite()
    const g = new Graphics()
    g.beginFill(NADE_COLORS[nade.type])
    g.drawCircle(-10, -10, 20)
    g.endFill()
    nadeSprite.addChild(g)

    this.activeNades.set(nade, nadeSprite)
    this.app.stage.addChild(nadeSprite)
    console.log("nade sprite added")
  }

  private _createLocation(config: LocationConfig): GameLocation {
    const location = new GameLocation()
    for (const objConf of config.objects) {
      switch (objConf.type) {
        case "character":
          location.addObject(new Character(objConf.position))
          break
        case "obstacle":
          location.addObject(new Obstacle(objConf.position))
          break
      }
    }
    return location
  }

  private _displayLocation(location: GameLocation) {
    const objectColors: Record<LocationObjectType, ColorSource> = {
      character: PALETTE.YELLOW,
      obstacle: PALETTE.ASPHALT
    }

    const locationDisplay = new Container()

    this.app.stage.addChild(new GroundLayer(10, 5))

    for (const obj of location.objects) {
      const sprite = new Sprite()
      const g = new Graphics()
      const color = objectColors[obj.type]
      g.beginFill(color)
      g.drawRect(-50, -50, 100, 100)
      g.endFill()
      sprite.addChild(g)
      sprite.anchor.set(0.5)

      const isoPos = getDisplayPos({ x: obj.pos.x, y: obj.pos.y / 2 })
      sprite.position.set(isoPos.x, isoPos.y)


      locationDisplay.addChild(sprite)
    }

    this.app.stage.addChild(locationDisplay)
  }

  // For pixi-inspector (https://github.com/bfanger/pixi-inspector) to work
  private _setupDebugFeatures() {
    globalThis.__PIXI_APP__ = this.app
  }
}
