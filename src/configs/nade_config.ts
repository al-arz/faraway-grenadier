import { NadeType } from "../model/nade";

export const NADE_ICONS = {
  frag: "frag",
  he: "he",
  thermal: "molotov"
} as const

export type ms = number

export type NadeConfig = {
  blastRadius: number
  damage: number
  maxRange: number
  aimDuration: ms
  flightDuration: ms,
}

export type ExplosionConfig = {
  animationKey: string,
  anchorY: number,
}

export const NADE_EXPLOSIONS: Record<NadeType, ExplosionConfig> = {
  frag: {
    animationKey: "expl_1",
    anchorY: 0.85
  },
  he: {
    animationKey: "expl_0",
    anchorY: 0.5
  },
  thermal: {
    animationKey: "expl_2",
    anchorY: 0.85
  },
}

export const NADE_CONFIG: Record<NadeType, NadeConfig> = {
  frag: {
    blastRadius: 200,
    damage: 80,
    maxRange: 80,
    aimDuration: 2000,
    flightDuration: 1500,
  },
  he: {
    blastRadius: 100,
    damage: 140,
    maxRange: 80,
    aimDuration: 2000,
    flightDuration: 1500,
  },
  thermal: {
    blastRadius: 150,
    damage: 110,
    maxRange: 50,
    aimDuration: 2000,
    flightDuration: 1500,
  }
}
