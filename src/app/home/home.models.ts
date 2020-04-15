import { ZipEntry } from "../zip-helper/zip.models";
/*
 * Entelect Challenge Engine
 */
export class Engine {
  tilesAhead = 20;
  tilesBehind = 5;
  totalLanes = 4;
  canvasWidth: number;
  tileSize: number;
  matches: Match[] = [];
  selectedFile: string;
}

export class Match {
  zipFile: ZipEntry[];
  filename: string;
  players: string[] = [];
  rounds: string[] = [];
  selectedRound = "";
  selectedPlayer = "";
  fileMap: FileMap;
  command: string[];
  endGame: string[];

  setRound(round: string): void {
    this.selectedRound = round;
  }

  setPlayer(player: string): void {
    this.selectedPlayer = player;
  }
}
/* */

/*
 * JsonMap.json
 */
export class FileMap {
  currentRound: number;
  maxRounds: number;
  player: Player;
  opponent: Opponent;
  worldMap?: ((WorldMapEntity)[] | null)[] | null;
}

export class Player {
  id: number;
  position: Position;
  speed: number;
  state: string;
  powerups?: (null)[] | null;
  boosting: boolean;
  boostCounter: number;
}

export class Position {
  y: number;
  x: number;
}

export class Opponent {
  id: number;
  position: Position;
  speed: number;
}

export class WorldMapEntity {
  position: Position;
  surfaceObject: number;
  occupiedByPlayerId: number;
}
/* */
