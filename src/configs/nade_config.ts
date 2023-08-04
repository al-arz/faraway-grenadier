import { NadeType } from "../model/nade";

export const NADE_ICONS = {
  frag: "frag",
  he: "he",
  thermal: "molotov"
} as const

export type NadeConfig = {
  maxThrowPower: number
  blastPower: number
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

export const FLIGHT_DISTANCE_PER_POWER = 17
export const FLIGHT_DURATION_PER_POWER = 10

export const NADE_CONFIG: Record<NadeType, NadeConfig> = {
  frag: {
    maxThrowPower: 100,
    blastPower: 40,
  },
  he: {
    maxThrowPower: 95,
    blastPower: 80,
  },
  thermal: {
    maxThrowPower: 90,
    blastPower: 60,
  }
}
