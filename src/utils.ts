import { utils } from "pixi.js";
import { ScreenPos, WorldPos } from "./model/game_location";

export const EventBus = new utils.EventEmitter()

// https://iquilezles.org/articles/functions/
export function quadFallof(value: number, trunc: number): number {
  const x = 1.0 / ((value + 1.0) * (value + 1.0));
  const m = 1.0 / ((trunc + 1.0) * (trunc + 1.0));
  return (x - m) / (1.0 - m);
}

// https://gamedev.stackexchange.com/questions/8151/how-do-i-sort-isometric-sprites-into-the-correct-order
export function isoFrom3D(pos: WorldPos): ScreenPos {
  return { x: pos.x + pos.y, y: ((pos.y - pos.x + pos.z * 2) / 2) }
}

export function zIndexFromWorldPos(pos: WorldPos) {
  return -(pos.x + pos.y + pos.z)
}
