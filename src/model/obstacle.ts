import { LocationObjectType } from "../configs/location_config";
import { HasPosition, Position } from "./game_location";

export class Obstacle implements HasPosition {
  type: LocationObjectType
  pos: Position

  constructor(initialPosition: Position) {
    this.type = "obstacle"
    this.pos = initialPosition
  }
}
