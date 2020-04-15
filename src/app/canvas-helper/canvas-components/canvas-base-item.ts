export abstract class CanvasBaseItem {
  constructor() {
    this.id = Math.random();
  }

  id: number;
  type: string;
  name: string;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;

  setContext(ctx: CanvasRenderingContext2D): CanvasBaseItem {
    this.ctx = ctx;
    return this;
  }

  abstract draw(): CanvasBaseItem;
}
