import { Graphics } from 'pixi.js';

export class Sunlight extends Graphics {
  _brightness = 0;

  constructor() {
    super();

    this.updateBackground();
  }

  updateBackground() {
    this.clear();

    this.rect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    ).fill({
      color: 0x000000,
      alpha: this._brightness
    });
  }

  update(ticker, time) {
    this._brightness = ((time - 12) ** 2) / 250;
    this.updateBackground();
  }
}