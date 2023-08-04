import { LocationConfig } from "../configs/location_config";
import { Character } from "../model/character";
import { GameLocation } from "../model/game_location";
import { Obstacle } from "../model/obstacle";

export class LocationBuilder {
  location: GameLocation

  constructor() {
  }

  createLocation(config: LocationConfig): GameLocation {
    const location = new GameLocation()
    for (const objConf of config.objects) {
      switch (objConf.objectKind) {
        case "character":
          location.addCharacter(new Character(objConf))
          break
        case "obstacle":
          location.addObstacle(new Obstacle(objConf))
          break
      }
    }
    return location
  }
}
