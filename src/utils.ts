import { utils } from "pixi.js";
import { ScreenPos, WorldPos } from "./model/game_location";

export const EventBus = new utils.EventEmitter()

export function quadFallof(value: number, trunc: number): number {
  const x = 1.0 / ((value + 1.0) * (value + 1.0));
  const m = 1.0 / ((trunc + 1.0) * (trunc + 1.0));
  return (x - m) / (1.0 - m);
}

// carthesian to isometric
export function getDisplayPos(pos: WorldPos): ScreenPos {
  return { x: pos.x + pos.y + 100, y: ((pos.y - pos.x) / 2) + 550 }
  // return { x: pos.x, y: pos.y }
}
