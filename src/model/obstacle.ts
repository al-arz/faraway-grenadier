import { HasPosition, Position } from "./game_location";

export class Obstacle implements HasPosition {
  type: "obstacle"
  pos: Position

  constructor(initialPosition: Position) {
    this.type = "obstacle"
    this.pos = initialPosition
  }
}
