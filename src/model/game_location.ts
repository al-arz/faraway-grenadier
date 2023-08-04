import { Character } from "./character"
import { Nade } from "./nade"
import { Obstacle } from "./obstacle"

export type WorldPos = { x: number, y: number, z: number }
export type ScreenPos = { x: number, y: number }

export interface HasPosition {
  position: WorldPos
}

export type LocationObject = Character | Obstacle

export class GameLocation {
  objects: LocationObject[] = []
  characters: Character[] = []
  obstacles: Obstacle[] = []

  constructor() {
  }

  addCharacter(obj: Character) {
    this.objects.push(obj)
    this.characters.push(obj)
  }

  addObstacle(obj: Obstacle) {
    this.objects.push(obj)
    this.obstacles.push(obj)
  }

  getPlayableCharacter(): Character | undefined {
    return this.characters.find(c => c.characterKind == "playable")
  }

  getFirstEnemy(): Character | undefined {
    return this.characters.find(c => c.characterKind == "enemy")
  }

  processExplosion(nade: Nade) {
    for (const target of this.characters) {
      const dx = target.position.x - nade.position.x
      const dy = target.position.y - nade.position.y

      const d = Math.sqrt(dx * dx + dy * dy)

      const bp = nade.config.blastPower
      const dmg = Math.max(0, bp - d)
      target.takeDamage(dmg)
    }
  }
}
