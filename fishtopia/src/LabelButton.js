import { Container, Graphics, Text } from 'pixi.js';

export class LabelButton extends Container {
    showLabels = true;
    label = "Hide Names"
    _sizeFactor = 1
    text

    constructor(layer) {
        super();

        if (window.innerWidth < 1024) {
            this._sizeFactor = 0.6
        } else {
            this._sizeFactor = 1
        }

        this.text = new Text({
            text: this.label,
            resolution: 2,
            style: {
                fill: '#ffffff',
                fontSize: 20 * this._sizeFactor,
            },
            anchor: 0.5
        })

        const padding = 10 * this._sizeFactor


        const bg = new Graphics()
            .roundRect(
                -this.text.width / 2 - padding * 1.5,
                -this.text.height / 2 - padding,
                this.text.width + padding * 2 * 1.5,
                this.text.height + padding * 2,
                20,
            ).fill({
                color: 0xbf2477,
                alpha: 1,
            });

        this.eventMode = "static"

        this.addChild(bg);
        this.addChild(this.text)
    }
}