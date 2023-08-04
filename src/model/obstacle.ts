import { ObstacleKind } from "../configs/location_config";
import { WorldPos } from "./game_location";

export interface ObstacleConfig {
  objectKind: "obstacle"
  position: WorldPos
  obstacleKind: ObstacleKind
}

export class Obstacle implements ObstacleConfig {
  objectKind: "obstacle"
  obstacleKind: ObstacleKind
  position: WorldPos

  constructor(config: ObstacleConfig) {
    Object.assign(this, config)
  }
}
