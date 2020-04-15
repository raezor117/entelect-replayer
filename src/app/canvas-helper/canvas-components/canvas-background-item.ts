import { CanvasBaseItem } from './canvas-base-item';
import { CanvasTextItem } from './canvas-text-item';

export class CanvasBackgroundItem extends CanvasBaseItem {
    placeholder: CanvasTextItem;
    image: HTMLImageElement;
    uri: string;
    width: number;
    height: number;
    imageWidth: number;
    imageHeight: number;
    promise: Promise<HTMLImageElement>;

    constructor(uri: string, width: number, height: number) {
        super();
        let self = this;
        self.setImage(uri, width, height);
        self.type = "CanvasBackgroundItem";
    }

    setImage(uri: string, width: number, height: number) {
        let self = this;
        self.uri = uri;
        self.width = width;
        self.height = height;
        self.promise = self.generatePromise();
    }

    setDimensions(width: number, height: number): CanvasBackgroundItem {
        let self = this;
        self.width = width;
        self.height = height;
        return self;
    }

    generatePromise(): Promise<HTMLImageElement> {
        let self = this;
        return new Promise((resolve, reject) => {
            let uriSource = new Image();
            uriSource.src = self.uri;
            uriSource.onload = (event: any) => {
                self.imageWidth = uriSource.width;
                self.imageHeight = uriSource.height;
                //Resolve Promise
                self.image = uriSource;
                resolve(uriSource);
            };
        });
    }

    getPromise(): Promise<HTMLImageElement> {
        let self = this;
        return self.promise;
    }

    draw(): CanvasBackgroundItem {
        let self = this;
        self.ctx.save();
        if (self.image) {
            self.ctx.drawImage(self.image, 0, 0, self.width, self.height);
        }
        self.ctx.restore();
        return self;
    }
}
