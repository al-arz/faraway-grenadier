import { NadeType } from "../model/nade";

export type NadeConfig = {
  blastRadius: number
  damage: number
  maxRange: number
  aimDurationMS: number
  flightDurationMS: number
}

export const NADE_CONFIG: Record<NadeType, NadeConfig> = {
  frag: {
    blastRadius: 200,
    damage: 10,
    maxRange: 80,
    aimDurationMS: 3000,
    flightDurationMS: 3000,
  },
  he: {
    blastRadius: 100,
    damage: 15,
    maxRange: 80,
    aimDurationMS: 3000,
    flightDurationMS: 3000,
  },
  thermal: {
    blastRadius: 120,
    damage: 20,
    maxRange: 50,
    aimDurationMS: 3000,
    flightDurationMS: 3000,
  }
}
