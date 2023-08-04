import { AnimatedSprite, Application, Assets, Container, DisplayObject, Sprite, Spritesheet } from "pixi.js";
import { DEBUG } from "./config";
import { LOCATION_CONFIG, LocationConfig } from "./configs/location_config";
import { GrenadeThrower } from "./creators/throw_controller";
import { GAME_EVENTS } from "./events";
import { GroundLayer } from "./ground_layer";
import { Character } from "./model/character";
import { GameLocation, LocationObject } from "./model/game_location";
import { NADE_ICON_KEYS, Nade, NadeType } from "./model/nade";
import { OBSTACLE_GFX, Obstacle } from "./model/obstacle";
import { NadeUI } from "./nade_ui";
import { PALETTE } from "./palette";
import { StatBar } from "./ui/statbar";
import { Target } from "./ui/target";
import { EventBus, getDisplayPos, isoFrom3D, quadFallof } from "./utils";

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
        this.updateNadeSprite(sprite, nade)
      })
    })

    EventBus.on(GAME_EVENTS.NADE_EXPLODED, (nade: Nade) => {
      const s = this.activeNades.get(nade)
      if (s) {
        this.app.stage.removeChild(s)
        const explosionSheet = Assets.get("fx") as Spritesheet
        console.log(explosionSheet)
        const explosion = new AnimatedSprite(explosionSheet.animations["boom"])
        explosion.play()
        explosion.onComplete = () => {
          this.app.stage.removeChild(explosion)
        }
        explosion.loop = false
        explosion.animationSpeed = 0.25
        this.app.stage.addChild(explosion)
        explosion.anchor.set(0.5, 0.85)
        explosion.position.set(s.x, s.y)
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
      const enemySprite = this.addEnemy(enemy)

      const enemyHPBar = new StatBar(100, 100)
      enemySprite.addChild(enemyHPBar)
      enemyHPBar.update(enemy.hp)
      enemyHPBar.position.set(-enemyHPBar.width / 2, enemyHPBar.height + 20 - enemySprite.height)

      EventBus.on(GAME_EVENTS.CHARACTER_HIT, (character: Character, damage: number) => {
        enemyHPBar.update(character.hp)
      })

      EventBus.on(GAME_EVENTS.CHARACTER_DIED, (character: Character) => {
        this._gameOver()
        enemyHPBar.visible = false
      })
    }


    if (DEBUG) {
      this._setupDebugFeatures()
    }
  }
  updateNadeSprite(sprite: Sprite, nade: Nade) {
    const isoPos = isoFrom3D(nade.pos)
    // const isoPos = getDisplayPos(nade.pos)
    sprite.position.set(isoPos.x, isoPos.y)
    sprite.angle += 5
  }

  private _gameOver() {
    alert("Game over")
  }

  private _launchNade(thrower: LocationObject, nade: Nade) {

    const nadeSprite = Sprite.from(NADE_ICON_KEYS[nade.type])
    nadeSprite.anchor.set(0.5)
    nadeSprite.scale.set(3)

    const target = new Target()
    const targetIso = isoFrom3D(nade.targetPos)
    target.position.set(targetIso.x, targetIso.y)
    this.app.stage.addChildAt(target, 2)

    EventBus.once(GAME_EVENTS.NADE_EXPLODED, () => this.app.stage.removeChild(target))

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
          location.addObject(new Obstacle(objConf.position, objConf.obstacleType))
          break
      }
    }
    return location
  }

  private _displayLocation(location: GameLocation) {
    const locationDisplay = new Container()

    this.app.stage.addChild(new GroundLayer(10, 5))

    this.addPlayableChar(location.getPlayableCharacter())

    for (const obj of location.obstacles) {
      const sprite = Sprite.from(OBSTACLE_GFX[obj.obstacleType])
      sprite.anchor.set(0.5)

      const isoPos = getDisplayPos({ x: obj.pos.x, y: obj.pos.y })
      sprite.position.set(isoPos.x, isoPos.y)


      locationDisplay.addChild(sprite)
    }

    this.app.stage.addChild(locationDisplay)
  }

  addEnemy(char: Character) {
    const c = new Container()
    const charSheet = Assets.get("chars") as Spritesheet
    const sprite = new AnimatedSprite(charSheet.animations["blue"])
    sprite.scale.set(-3, 3)
    this.setupCharSprite(sprite, char)
    this.setCharPosition(c, char)
    c.addChild(sprite)
    this.app.stage.addChild(c)
    return c
  }

  setupCharSprite(sprite: AnimatedSprite, char: Character) {
    sprite.anchor.set(0.5, 0.7)
    sprite.play()
    sprite.animationSpeed = 0.25
  }

  addPlayableChar(char: Character | undefined) {
    if (!char) return

    const charSheet = Assets.get("chars") as Spritesheet
    const sprite = new AnimatedSprite(charSheet.animations["red"])
    sprite.scale.set(3)
    this.setupCharSprite(sprite, char)
    this.setCharPosition(sprite, char)
    this.app.stage.addChild(sprite)
  }

  setCharPosition(c: DisplayObject, char: Character) {
    const isoPos = getDisplayPos({ x: char.pos.x, y: char.pos.y })
    c.position.set(isoPos.x, isoPos.y)
  }

  // For pixi-inspector (https://github.com/bfanger/pixi-inspector) to work
  private _setupDebugFeatures() {
    globalThis.__PIXI_APP__ = this.app
  }
}
