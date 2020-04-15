import { CanvasBaseItem } from './canvas-base-item';

export class CanvasTextItem extends CanvasBaseItem {
    content: string;
    fontSize: number;
    fontStyle: string;
    center: boolean;
    textAlign: CanvasTextAlign;
    foregroundColor: string;
    backgroundColor: string;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        content: string,
        fontSize = 16,
        fontStyle = "Arial",
        center = false,
        foregroundColor = "#000",
        backgroundColor = null) {
        super();
        let self = this;
        self.x = x;
        self.y = y;
        self.width = width;
        self.height = height;

        self.content = content;
        self.fontSize = fontSize;
        self.fontStyle = fontStyle;
        self.center = center;
        self.foregroundColor = foregroundColor;
        self.backgroundColor = backgroundColor;
        self.type = "CanvasTextItem";
    }

    draw(): CanvasTextItem {
        let self = this;
        self.ctx.save();

        self.ctx.font = `${Math.round(self.fontSize)}px ${self.fontStyle}`;

        if (self.backgroundColor) {
            self.ctx.fillStyle = self.backgroundColor;
            // Add Background
            self.ctx.fillRect(self.x, self.y, self.width, self.height);
        }
        
        self.ctx.fillStyle = self.foregroundColor;
        self.ctx.textAlign = self.textAlign;

        const textBounds = self.ctx.measureText(self.content);
        const textHeightAdjustment = (self.height / 2) + (textBounds.actualBoundingBoxAscent / 2);
        let textWidthAdjustment = 0;
        if (self.center) textWidthAdjustment = (self.width - textBounds.width) / 2;
        // Add Text
        self.ctx.fillText(self.content, self.x + textWidthAdjustment, self.y + textHeightAdjustment, self.width);        

        self.ctx.restore();
        return self;
    }
}
