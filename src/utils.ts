import { utils } from "pixi.js";

export const EventBus = new utils.EventEmitter()

export function quadFallof(value: number, trunc: number): number {
  const x = 1.0 / ((value + 1.0) * (value + 1.0));
  const m = 1.0 / ((trunc + 1.0) * (trunc + 1.0));
  return (x - m) / (1.0 - m);
}
