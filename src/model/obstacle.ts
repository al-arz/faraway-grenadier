import { HasPosition, WorldPos } from "./game_location";

export const OBSTACLE_GFX = {
  a: "barrier_A",
  b: "barrier_B",
} as const

export type ObstacleType = keyof typeof OBSTACLE_GFX;

export class Obstacle implements HasPosition {
  type: "obstacle"
  obstacleType: "a" | "b"
  pos: WorldPos

  constructor(initialPosition: WorldPos, obstacleType: ObstacleType) {
    this.type = "obstacle"
    this.obstacleType = obstacleType
    this.pos = initialPosition
  }
}
