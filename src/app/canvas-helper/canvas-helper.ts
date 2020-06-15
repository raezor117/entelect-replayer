import { ElementRef } from '@angular/core';
import { Match, FileMap } from '../home/home.models';
import { ZipService } from '../zip-helper/zip.service';
import { CanvasBlockItem } from './canvas-components/canvas-block-item';
import { CanvasTextItem } from './canvas-components/canvas-text-item';
import { CanvasBlockBorderItem } from './canvas-components/canvas-block-border-item';

export class CanvasHelper {
  constructor(protected zipService: ZipService,
    private htmlCanvasElement: ElementRef<HTMLCanvasElement>,
    private width: number = 0,
    private height: number = 0,
    private tileSize: number = 0
  ) {
    this.reset();
  }

  private _ctx: CanvasRenderingContext2D;
  private _canvas: HTMLCanvasElement;

  public render(match: Match): CanvasHelper {
    let self = this;
    // Reset Canvas
    self.reset();
    // Setup scaling
    self._canvas.width = self.width;
    self._canvas.height = self.height;
    // Set FileMap
    const file = match.zipFile.filter(filter =>
      filter.filename.includes(match.selectedPlayer) &&
      filter.filename.includes(match.selectedRound) &&
      filter.filename.includes("JsonMap.json"))[0];

    self.zipService.getData(file).data.subscribe(data => {
      const reader = new FileReader();
      reader.onload = function () {
        match.fileMap = (JSON.parse(reader.result as string) as FileMap);
        // Add elements
        self.addElements(match.fileMap);

        // Next Match Player A
        const nextMatchRoundA = match.rounds.indexOf(match.selectedRound);
        const nextFileA = match.zipFile.filter(filter =>
          filter.filename.includes(match.players[0]) &&
          filter.filename.includes(match.rounds[nextMatchRoundA + 1]) &&
          filter.filename.includes("JsonMap.json"));
        if (nextFileA.length > 0) {
          self.zipService.getData(nextFileA[0]).data.subscribe(nextdataA => {
            const nextFilereaderA = new FileReader();
            nextFilereaderA.onload = function () {
              const nextRoundFileMapA = (JSON.parse(nextFilereaderA.result as string) as FileMap);
              // Add elements
              self.nextRoundPlayerA(nextRoundFileMapA, match.fileMap.worldMap[0][0].position.x, match.selectedPlayer === match.players[0] ? 5 : 3);
            };
            nextFilereaderA.readAsText(nextdataA);
          });
        }
        // Next Match Player B
        const nextMatchRoundB = match.rounds.indexOf(match.selectedRound);
        const nextFileB = match.zipFile.filter(filter =>
          filter.filename.includes(match.players[1]) &&
          filter.filename.includes(match.rounds[nextMatchRoundB + 1]) &&
          filter.filename.includes("JsonMap.json"));
        if (nextFileB.length > 0) {
          self.zipService.getData(nextFileB[0]).data.subscribe(nextdataB => {
            const nextFilereaderB = new FileReader();
            nextFilereaderB.onload = function () {
              const nextRoundFileMapB = (JSON.parse(nextFilereaderB.result as string) as FileMap);
              // Add elements
              self.nextRoundPlayerB(nextRoundFileMapB, match.fileMap.worldMap[0][0].position.x, match.selectedPlayer === match.players[1] ? 5 : 3);
            };
            nextFilereaderB.readAsText(nextdataB);
          });
        }
      };
      reader.readAsText(data);
    });

    

    // Set Command
    const command = match.zipFile.filter(filter =>
      filter.filename.includes(match.selectedPlayer) &&
      filter.filename.includes(match.selectedRound) &&
      filter.filename.includes("PlayerCommand.txt"))[0];

    self.zipService.getData(command).data.subscribe(data => {
      const reader = new FileReader();
      reader.onload = function () {
        match.command = (reader.result as string).split(/\r?\n/);
      };
      reader.readAsText(data);
    });
    return self;
  }

  public reset(): CanvasHelper {
    let self = this;
    // Possibly Remove all Elements...
    self._canvas = self.htmlCanvasElement.nativeElement;
    self._ctx = self._canvas.getContext('2d');
    self._ctx.clearRect(0, 0, self.width, self.height);
    return self;
  }
  // Get Actions End

  public addElements(fileMap: FileMap) {
    let self = this;
    for (let y = 0; y < fileMap.worldMap.length; y++) {
      for (let x = 0; x < fileMap.worldMap[y].length; x++) {
        let color = "#000";
        switch (fileMap.worldMap[y][x].surfaceObject) {
          case 1: color = "#BA4A00"; break;
          case 2: color = "#2F4F4F"; break;
          case 3: color = "#F4DA00"; break;
          case 4: color = "#FFFFFF"; break;
          case 5: color = "#00FF13"; break;
          case 6: color = "#4D4D4D"; break;
          case 7: color = "#A6FF00"; break;
          case 8: color = "#00FFFF"; break;
          default:
            if (x < 5 && fileMap.currentRound !== 1) color = "#ABB2B9";
            else color = "#D5D8DC";
            break;
        }
        switch (fileMap.worldMap[y][x].occupiedByPlayerId) {
          case 1: color = "#007bff"; break;
          case 2: color = "#dc3545"; break;
          default: break;
        }
        if (fileMap.worldMap[y][x].isOccupiedByCyberTruck) {
          color = "#B47CD9";
        }

        new CanvasBlockItem((x * self.tileSize), (y * self.tileSize), self.tileSize, self.tileSize, color, true, 2).setContext(self._ctx).draw();

        new CanvasTextItem((x * self.tileSize), (y * self.tileSize), self.tileSize, self.tileSize, `[${fileMap.worldMap[y][x].position.x}, ${fileMap.worldMap[y][x].position.y}]`, 10, null, true).setContext(self._ctx).draw();

        let playerAdjustYText = 0;
        if (self.tileSize > 40) {
          if (fileMap.worldMap[y][x].occupiedByPlayerId) {
            playerAdjustYText = 10;
            new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12, self.tileSize, self.tileSize, `<PLAYER>`, 10, null, true).setContext(self._ctx).draw();
          } 
          switch (fileMap.worldMap[y][x].surfaceObject) {
            case 1:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<MUD>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 2:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<OIL SPILL>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 3:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<OIL>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 4:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<FINISH>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 5:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<BOOST>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 6:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<WALL>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 7:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<LIZARD>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            case 8:
              new CanvasTextItem((x * self.tileSize), (y * self.tileSize) + 12 + playerAdjustYText, self.tileSize, self.tileSize, `<TWEET>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
              break;
            default:
              break;
          }
          if (fileMap.worldMap[y][x].isOccupiedByCyberTruck) {
            new CanvasTextItem((x * self.tileSize), (y * self.tileSize) - 12, self.tileSize, self.tileSize, `<TRUCK>`, playerAdjustYText > 0 ? 9 : 10, null, true).setContext(self._ctx).draw();
          }
        }
      }
    }
  }

  public nextRoundPlayerA(fileMap: FileMap, startingMatchX: number, size: number = 3) {
    let self = this;
    fileMap.worldMap.map(a => a.map(block => {
      switch (block.occupiedByPlayerId) {
        case 1:
          new CanvasBlockBorderItem(((block.position.x - startingMatchX) * self.tileSize), ((block.position.y - 1) * self.tileSize), self.tileSize, self.tileSize, size, "#007bff").setContext(self._ctx).draw();
          break;
        default: break;
      }
    }));
  }

  public nextRoundPlayerB(fileMap: FileMap, startingMatchX: number, size: number = 3) {
    let self = this;
    fileMap.worldMap.map(a => a.map(block => {
      switch (block.occupiedByPlayerId) {
        case 2:
          new CanvasBlockBorderItem(((block.position.x - startingMatchX) * self.tileSize), ((block.position.y - 1) * self.tileSize), self.tileSize, self.tileSize, size, "#dc3545").setContext(self._ctx).draw();
          break;
        default: break;
      }
    }));
  }
}
