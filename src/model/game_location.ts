import { Character } from "./character"
import { Obstacle } from "./obstacle"

export type WorldPos = { x: number, y: number }
export type ScreenPos = { x: number, y: number }

export interface HasPosition {
  pos: WorldPos
}

export type LocationObject = Character | Obstacle

export class GameLocation {
  objects: LocationObject[] = []
  characters: Character[] = []
  obstacles: Obstacle[] = []

  constructor() {
  }

  addObject(obj: LocationObject) {
    this.objects.push(obj)
    switch (obj.type) {
      case "character":
        this.characters.push(obj)
        break
      case "obstacle":
        this.obstacles.push(obj)
        break
    }
  }

  getPlayableCharacter(): Character | undefined {
    return this.characters[0]
  }

  getEnemy(): Character | undefined {
    return this.characters[1]
  }
}
