import { CanvasBaseItem } from './canvas-base-item';

export class CanvasBlockItem extends CanvasBaseItem {

  color: string;
  hasBorder: boolean;
  borderWidth: number;
  borderColor: string;

  constructor(x: number, y: number,
      width: number,height: number, color: string,
      hasBorder = false, borderWidth = 0, borderColor = "#000") {
    super();
    let self = this;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.color = color;
    self.hasBorder = hasBorder;
    self.borderWidth = borderWidth;
    self.borderColor = borderColor;
    self.type = "CanvasBlockItem";
  }

  draw(): CanvasBlockItem {
    let self = this;
    self.ctx.save();
    if (self.hasBorder) {
      self.ctx.beginPath();
      self.ctx.strokeStyle = self.borderColor;
      self.ctx.lineWidth = self.borderWidth;
      self.ctx.rect(self.x, self.y, self.width, self.height);
      self.ctx.stroke();
    }
    self.ctx.fillStyle = self.color;
    self.ctx.fillRect(self.x, self.y, self.width, self.height);
    self.ctx.restore();
    return self;
  }
}
