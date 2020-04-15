import { CanvasBaseItem } from './canvas-base-item';
import { CanvasTextItem } from './canvas-text-item';

export class CanvasImageItem extends CanvasBaseItem {
    placeholder: CanvasTextItem;
    image: HTMLImageElement;

    draw(): CanvasImageItem {
        let self = this;

        return self;
    }
}
