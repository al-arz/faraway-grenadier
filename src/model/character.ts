import { LocationObjectType } from "../configs/location_config";
import { HasPosition, Position } from "./game_location";

export class Character implements HasPosition {
  type: LocationObjectType
  pos: Position

  constructor(initialPosition: Position) {
    this.type = "character"
    this.pos = initialPosition
  }
}
