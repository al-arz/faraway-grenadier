import { AnimatedSprite, Application, Assets, Container, IPoint, Sprite, Spritesheet } from "pixi.js";
import { DEBUG } from "./config";
import { LOCATION_CONFIG, OBSTACLE_GFX } from "./configs/location_config";
import { NADE_ICONS } from "./configs/nade_config";
import { GAME_EVENTS } from "./events";
import { GroundLayer } from "./ground_layer";
import { GameLocation, WorldPos } from "./model/game_location";
import { Nade, NadeType } from "./model/nade";
import { NadeUI } from "./nade_ui";
import { GrenadeThrower } from "./systems/grenade_thrower";
import { LocationBuilder } from "./systems/location_builder";
import { Target } from "./ui/target";
import { EventBus, isoFrom3D } from "./utils";
import { CharacterSprite } from "./views/character_sprite";

export class Game {
  app: Application

  location: GameLocation
  locationView: Container
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
    this.app.ticker.add(() => {
      this.activeNades.forEach((sprite, nade) => {
        nade.update(this.app.ticker.deltaMS)
        this.updateNadeSprite(sprite, nade)
      })
    })

    EventBus.on(GAME_EVENTS.NADE_EXPLODED, this._onNadeExplosion.bind(this))
    EventBus.on(GAME_EVENTS.CHARACTER_DIED, (_) => {
      this._gameOver()
    })

    this.locationView = this.createLocationView(this.location)
    this.app.stage.addChild(this.locationView)
    this.app.stage.addChild(nadeUI)

    if (DEBUG) {
      this._setupDebugFeatures()
    }
  }

  createThrower(pos: WorldPos) {
    const thrower = new GrenadeThrower(pos)

    EventBus.on(GAME_EVENTS.NADE_LAUNCHED, (n: Nade) => {
      this._addNadeSprite(n)
    })

    this.app.ticker.add(() => {
      thrower.update(this.app.ticker.deltaMS)
    })

    return thrower
  }

  createLocationView(location: GameLocation) {
    const locationView = new Container()

    locationView.addChild(new GroundLayer(10, 5))

    const playableChar = location.getPlayableCharacter()
    if (playableChar) {
      const playableCharSprite = new CharacterSprite(playableChar)
      locationView.addChild(playableCharSprite)
    }

    const enemy = this.location.getFirstEnemy()
    if (enemy) {
      const enemySprite = new CharacterSprite(enemy)
      enemySprite.addHPBar(enemy)
      locationView.addChild(enemySprite)
    }

    for (const obj of location.obstacles) {
      const sprite = Sprite.from(OBSTACLE_GFX[obj.obstacleKind])
      sprite.anchor.set(0.5)

      const screenPos = isoFrom3D(obj.position)
      sprite.position.set(screenPos.x, screenPos.y)


      locationView.addChild(sprite)
    }

    return locationView
  }

  private _onNadeExplosion(nade: Nade) {
    const nadeSprite = this.activeNades.get(nade)
    if (nadeSprite) {
      this.showExplosion(nadeSprite.position)
      this.app.stage.removeChild(nadeSprite)
      this.activeNades.delete(nade)
    }

    this.location.processExplosion(nade)
  }

  showExplosion(pos: IPoint) {
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
    explosion.position.copyFrom(pos)
  }

  updateNadeSprite(sprite: Sprite, nade: Nade) {
    const screenPos = isoFrom3D(nade.position)
    sprite.position.set(screenPos.x, screenPos.y)
    sprite.angle += 5
  }

  private _gameOver() {
    alert("Game over")
  }

  private _addNadeSprite(nade: Nade) {
    const nadeSprite = Sprite.from(NADE_ICONS[nade.type])
    nadeSprite.anchor.set(0.5)
    nadeSprite.scale.set(3)

    const target = new Target()
    const targetIso = isoFrom3D(nade.targetPos)
    target.position.set(targetIso.x, targetIso.y)
    this.app.stage.addChildAt(target, 2)

    EventBus.once(GAME_EVENTS.NADE_EXPLODED, () => this.app.stage.removeChild(target))

    this.activeNades.set(nade, nadeSprite)
    this.app.stage.addChild(nadeSprite)
  }

  // For pixi-inspector (https://github.com/bfanger/pixi-inspector) to work
  private _setupDebugFeatures() {
    globalThis.__PIXI_APP__ = this.app
  }
}
