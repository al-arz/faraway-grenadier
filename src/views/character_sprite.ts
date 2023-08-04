import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from "pixi.js";
import { GAME_EVENTS } from "../events";
import { Character } from "../model/character";
import { StatBar } from "../ui/statbar";
import { EventBus, isoFrom3D } from "../utils";

export class CharacterSprite extends Container {
  constructor(char: Character) {
    super()

    const charSheet = Assets.get("chars") as Spritesheet
    const anim = this.getCharacterAnim(char)
    const sprite = new AnimatedSprite(charSheet.animations[anim])
    this.setScale(sprite, char)
    this.setupSprite(sprite)
    this.setPosition(char)
    this.addChild(sprite)
  }

  setScale(sprite: Sprite, char: Character) {
    switch (char.characterKind) {
      case "playable": sprite.scale.set(3); break
      case "enemy": sprite.scale.set(-3, 3); break
    }
  }

  setupSprite(sprite: AnimatedSprite) {
    sprite.anchor.set(0.5, 0.7)
    sprite.play()
    sprite.animationSpeed = 0.25
  }

  getCharacterAnim(char: Character) {
    switch (char.characterKind) {
      case "playable": return "red"
      case "enemy": return "blue"
    }
  }

  setPosition(char: Character) {
    const screenPos = isoFrom3D(char.position)
    this.position.set(screenPos.x, screenPos.y)
  }

  addHPBar(enemy: Character) {
    const enemyHPBar = new StatBar(100, 100)
    enemyHPBar.showAbove(this)

    EventBus.on(GAME_EVENTS.CHARACTER_HIT, (character: Character, damage: number) => {
      enemyHPBar.update(character.hp)
    })

    EventBus.on(GAME_EVENTS.CHARACTER_DIED, (character: Character) => {
      enemyHPBar.visible = false
    })
  }
}
