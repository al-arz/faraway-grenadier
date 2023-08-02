import { NadeType } from "../model/nade";

export type ms = number

export type NadeConfig = {
  blastRadius: number
  damage: number
  maxRange: number
  aimDuration: ms
  flightDuration: ms
}

export const NADE_CONFIG: Record<NadeType, NadeConfig> = {
  frag: {
    blastRadius: 200,
    damage: 40,
    maxRange: 80,
    aimDuration: 1000,
    flightDuration: 1500,
  },
  he: {
    blastRadius: 100,
    damage: 70,
    maxRange: 80,
    aimDuration: 1000,
    flightDuration: 1500,
  },
  thermal: {
    blastRadius: 120,
    damage: 60,
    maxRange: 50,
    aimDuration: 1000,
    flightDuration: 1500,
  }
}
