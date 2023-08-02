import { Position } from "../model/game_location"

export type LocationObjectType = "character" | "obstacle"

export type LocationObjectConfig = {
  type: LocationObjectType
  position: Position
}

export type LocationConfig = { objects: LocationObjectConfig[] }

export const LOCATION_CONFIG: LocationConfig = {
  objects: [
    {
      type: "character",
      position: { x: 100, y: 500 }
    },
    {
      type: "obstacle",
      position: { x: 300, y: 500 }
    },
    {
      type: "obstacle",
      position: { x: 600, y: 500 }
    },
    {
      type: "character",
      position: { x: 800, y: 500 }
    },
  ]
}
