import { CanvasBaseItem } from './canvas-base-item';

export class CanvasBlockBorderItem extends CanvasBaseItem {

  color: string;
  hasBorder: boolean;
  borderWidth: number;
  borderColor: string;

  constructor(x: number, y: number,
    width: number, height: number,
    borderWidth = 1, borderColor = "#000") {
    super();
    let self = this;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.borderWidth = borderWidth;
    self.borderColor = borderColor;
    self.type = "CanvasBlockBorderItem";
  }

  draw(): CanvasBlockBorderItem {
    let self = this;
    self.ctx.save();
    self.ctx.beginPath();
    self.ctx.strokeStyle = self.borderColor;
    self.ctx.lineWidth = self.borderWidth;
    self.ctx.rect(self.x, self.y, self.width, self.height);
    self.ctx.stroke();
    self.ctx.restore();
    return self;
  }
}
