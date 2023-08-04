import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from "pixi.js"
import { OBSTACLE_GFX } from "../configs/location_config"
import { NADE_ICONS } from "../configs/nade_config"
import { GAME_EVENTS } from "../events"
import { GameLocation, WorldPos } from "../model/game_location"
import { Nade } from "../model/nade"
import { Target } from "../ui/target"
import { EventBus, isoFrom3D, zIndexFromWorldPos } from "../utils"
import { CharacterSprite } from "./character_sprite"
import { GroundLayer } from "./ground_layer"

export class LocationView extends Container {
  location: GameLocation
  sortable: Container

  constructor(location: GameLocation) {
    super()
    this.location = location

    const ground = this.addChild(new GroundLayer(10, 5))
    this.sortable = this.addChild(new Container())
    this.sortable.sortableChildren = true

    const playableChar = location.getPlayableCharacter()
    if (playableChar) {
      const playableCharSprite = new CharacterSprite(playableChar)
      this.addSortable(playableCharSprite, playableChar.position)
    }

    const enemy = this.location.getFirstEnemy()
    if (enemy) {
      const enemySprite = new CharacterSprite(enemy)
      enemySprite.addHPBar(enemy)
      this.addSortable(enemySprite, enemy.position)
    }

    for (const obj of location.obstacles) {
      const sprite = Sprite.from(OBSTACLE_GFX[obj.obstacleKind])
      sprite.anchor.set(0.5)

      const screenPos = isoFrom3D(obj.position)
      sprite.position.set(screenPos.x, screenPos.y)

      this.addSortable(sprite, obj.position)
    }
  }

  createNadeSprite(nade: Nade): Sprite {
    const nadeSprite = Sprite.from(NADE_ICONS[nade.type])
    nadeSprite.anchor.set(0.5)
    nadeSprite.scale.set(3)

    const target = new Target()
    const targetIso = isoFrom3D(nade.targetPos)
    target.position.set(targetIso.x, targetIso.y)

    EventBus.once(GAME_EVENTS.NADE_EXPLODED, () => this.removeChild(target))
    this.addChildAt(target, 1)
    this.addSortable(nadeSprite, nade.position)
    return nadeSprite
  }

  explode(nadeSprite: Sprite, worldPos: WorldPos) {
    this.showExplosion(worldPos)
    this.sortable.removeChild(nadeSprite)
  }

  showExplosion(worldPos: WorldPos) {
    const explosionSheet = Assets.get("fx") as Spritesheet
    console.log(explosionSheet)
    const explosion = new AnimatedSprite(explosionSheet.animations["boom"])
    explosion.play()
    explosion.onComplete = () => {
      this.sortable.removeChild(explosion)
    }
    explosion.loop = false
    explosion.animationSpeed = 0.25
    this.addSortable(explosion, worldPos)
    explosion.anchor.set(0.5, 0.85)
    explosion.position.copyFrom(isoFrom3D(worldPos))
  }

  updateNadeSprite(sprite: Sprite, nade: Nade) {
    const screenPos = isoFrom3D(nade.position)
    sprite.position.set(screenPos.x, screenPos.y)
    sprite.angle += 5
    this.zIndex = zIndexFromWorldPos(nade.position)
  }

  addSortable(c: Container, wp: WorldPos) {
    this.sortable.addChild(c)
    c.zIndex = zIndexFromWorldPos(wp)
  }
}
