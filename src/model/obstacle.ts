import { HasPosition, WorldPos } from "./game_location";

export class Obstacle implements HasPosition {
  type: "obstacle"
  pos: WorldPos

  constructor(initialPosition: WorldPos) {
    this.type = "obstacle"
    this.pos = initialPosition
  }
}
