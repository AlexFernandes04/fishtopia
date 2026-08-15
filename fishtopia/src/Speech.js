import { Container, Graphics, Text } from 'pixi.js';

export class Speech extends Container {
  label;
  bg;
  padding = 10;
  _sizeFactor = 1

  constructor(text) {
    super();

    if (window.innerWidth < 1024) {
      this._sizeFactor = 0.8
    } else {
      this._sizeFactor = 1
    }

    this.padding = 10 * this._sizeFactor;


    this.label = new Text({
      text: text,
      resolution: 2,
      style: { fontSize: 16 * this._sizeFactor, fill: 0x000000 },
      anchor: 0.5,
    });

    this.bg = new Graphics()
      .roundRect(
        -this.label.width / 2 - this.padding,
        -this.label.height / 2 - this.padding,
        this.label.width + this.padding * 2,
        this.label.height + this.padding * 2,
        20,
      )
      .fill({
        color: 0xffffff,
        alpha: 0.6,
      });

    this.addChild(this.bg, this.label);
  }

  generateBackground() {
    this.bg.clear()

    this.bg.roundRect(
      -this.label.width / 2 - this.padding,
      -this.label.height / 2 - this.padding,
      this.label.width + this.padding * 2,
      this.label.height + this.padding * 2,
      20,
    )
      .fill({
        color: 0xffffff,
        alpha: 0.6,
      });
  }
}