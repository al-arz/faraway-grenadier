import { GameLocation } from "../model/game_location";

export class LocationBuilder {
  location: GameLocation

  constructor(createLocation: boolean) {
    if (createLocation) {
      this.location = new GameLocation()
    }
  }

  addObstacle(obstacle) {
    this.location.objects
  }
}
