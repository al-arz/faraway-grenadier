import { LocationObjectType } from "../configs/location_config"

export type Position = { x: number, y: number }

export interface HasPosition {
  pos: Position
}

export interface LocationObject extends HasPosition {
  type: LocationObjectType
}

export class GameLocation {
  objects: LocationObject[]
  constructor() {
    this.objects = []
  }

  addObject(obj: LocationObject) {
    this.objects.push(obj)
  }

  getFirstCharacter(): LocationObject | undefined {
    return this.objects.find(o => o.type == "character")
  }
}
