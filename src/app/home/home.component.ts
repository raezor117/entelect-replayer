import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CanvasHelper } from '../canvas-helper/canvas-helper';
import { ZipService } from '../zip-helper/zip.service';
import { Engine, Match } from './home.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(protected _router: Router, protected zipService: ZipService) {
    // Constructor
  }

  @ViewChild('canvasgame', { static: true }) canvasgame: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileUploader', { static: true }) fileUploader: ElementRef<HTMLInputElement>;
  @ViewChild('round', { static: true }) round: ElementRef<HTMLInputElement>;
  private _CH: CanvasHelper;
  engine: Engine = new Engine();
  selectedMatch: Match = null;

  ngOnInit(): void {
    this.engine.canvasWidth = this.canvasgame.nativeElement.parentElement.clientWidth;
    this.engine.tileSize = this.engine.canvasWidth / (1 + this.engine.tilesBehind + this.engine.tilesAhead);
    this._CH = new CanvasHelper(this.zipService, this.canvasgame,
    this.engine.canvasWidth, this.engine.tileSize * this.engine.totalLanes, this.engine.tileSize);
  }

  restart(): void {
    const self = this;
    self.engine = new Engine();
    self.selectedMatch = null;
    self._router.navigate(['restart']);
  }

  reset(): void {
    const self = this;
    self.engine.canvasWidth = this.canvasgame.nativeElement.parentElement.clientWidth;
    self.engine.tileSize = this.engine.canvasWidth / (1 + this.engine.tilesBehind + this.engine.tilesAhead);
    self._CH = new CanvasHelper(this.zipService, this.canvasgame,
      self.engine.canvasWidth, this.engine.tileSize * this.engine.totalLanes, this.engine.tileSize);
    self.round.nativeElement.value = "0";
    self.setRoundIndex(0);
    self._CH.render(self.selectedMatch);
  }

  selectFile(filename: string) {
    const self = this;
    self.engine.selectedFile = filename;
    self.selectedMatch = self.engine.matches.filter(a => a.filename === filename)[0];
    self.selectedMatch.setRound(self.selectedMatch.rounds[0]);
    self.selectedMatch.setPlayer(self.selectedMatch.players[0]);
    self.reset();

    const endGame = self.selectedMatch.zipFile.filter(filter => filter.filename.includes("endGameState.txt"))[0];
    self.zipService.getData(endGame).data.subscribe(data => {
      const reader = new FileReader();
      reader.onload = function () {
        self.selectedMatch.endGame = (reader.result as string).split(/\r?\n/);
      };
      reader.readAsText(data);
    });
  }

  setRoundIndex(round: number): void {
    const self = this;
    if (round < 0) return;
    if (round >= self.selectedMatch.rounds.length) return;
    self.setRound(self.selectedMatch.rounds[round]);
  }

  setRound(round: string): void {
    const self = this;
    self.selectedMatch.setRound(round);
    self._CH.render(this.selectedMatch);
  }

  setPlayer(player: string): void {
    const self = this;
    self.selectedMatch.setPlayer(player);
    self._CH.render(this.selectedMatch);
  }

  changeRound(): void {
    const self = this;
    self.setRoundIndex(window.prompt("Enter a round (number)") as unknown as number - 1);
  }

  removeMatch(): void {
    const self = this;
    self.engine.matches.splice(self.engine.matches.indexOf(self.selectedMatch), 1);
    self.selectedMatch = null;
  }

  openFile(): void {
    this.fileUploader.nativeElement.click();
  }

  fileChanged(event) {
    const self = this;
    const file = (event.target.files[0] as File);
    self.fileUploader.nativeElement.value = null;
    self.zipService.getEntries(file).subscribe(async zipFile => {
      const match = new Match();
      match.zipFile = zipFile;
      match.filename = file.name;

      const rounds = zipFile.map(file => {
        return file.filename.split("/")
          .filter(filter => filter.includes("Round"))[0];
      }).filter(self.onlyUnique)
        .filter(filter => filter !== undefined);
      match.rounds = rounds;

      const players = zipFile.map(file => {
        const playerA = file.filename.split("/")
          .filter(filter => filter.includes("A - "))[0];
        if (playerA !== undefined) return playerA
        const playerB = file.filename.split("/")
          .filter(filter => filter.includes("B - "))[0];
        if (playerB !== undefined) return playerB
        return undefined;
      }).filter(self.onlyUnique)
        .filter(filter => filter !== undefined)
        .filter(filter => !filter.includes(".csv"));
      match.players = players;

      self.engine.matches.push(match);
      self.selectFile(file.name);

      

      "endGameState.txt"
    });
  }

  onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
  }

  ngOnDestroy(): void {
   /* Destroy */
  }
}
