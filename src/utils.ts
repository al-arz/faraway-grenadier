import { utils } from "pixi.js";
import { ScreenPos, WorldPos } from "./model/game_location";
import { Pos3D } from "./model/nade";

export const EventBus = new utils.EventEmitter()

export function quadFallof(value: number, trunc: number): number {
  const x = 1.0 / ((value + 1.0) * (value + 1.0));
  const m = 1.0 / ((trunc + 1.0) * (trunc + 1.0));
  return (x - m) / (1.0 - m);
}

// carthesian to isometric
export function getDisplayPos(pos: WorldPos): ScreenPos {
  return { x: pos.x + pos.y + 100, y: ((pos.y - pos.x) / 2) + 550 }
  // return { x: pos.x + 100, y: pos.y + 300 }
}

export function isoFrom3D(pos: Pos3D): ScreenPos {
  const sx = (pos.x - pos.z) / Math.sqrt(2);
  const sy = (pos.x + 2 * pos.y + pos.z) / Math.sqrt(6);

  // return { x: sx, y: sy }

  // const dPos = getDisplayPos(pos)

  return { x: pos.x + pos.y + 100, y: ((pos.y - pos.x + pos.z * 2) / 2) + 550 }
}
