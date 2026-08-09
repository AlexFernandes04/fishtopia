import { Container, Sprite } from 'pixi.js';
import { CharacterUI } from './CharacterUI';

export class Fish extends Container {
  ui;
  _speed = 1;
  _xdirection = Math.random() > 0.5 ? 1 : -1;
  _anxiety = 0.5;
  _sleepTime = 23;
  _sleepCutoff = 23;
  _sleeping = false;
  fishView;
  offset = Math.floor(Math.random() * (5 - 1 + 1)) + 1
  showLabel = true;

  constructor(texture, name, size, sociallvl, anxietylvl, speed, sleeplength, sleephabits) {
    super();

    this.fishView = new Sprite(texture);

    this.fishView.anchor.set(0.5);

    this.addChild(this.fishView);

    this._speed = this._speed * speed / 2

    this._anxiety = (anxietylvl - 1) / 4

    this._sleepTime = sleephabits
    this._sleepCutoff = (this._sleepTime + sleeplength * 2) % 24

    console.log(this._sleepCutoff)

    this.fishView.scale.set(0.5 * this._xdirection * size / 3, 0.5 * size / 3)
    this.fishView.eventMode = 'static';

    this.ui = new CharacterUI(name);
    // this.ui.visible = false
    this.ui.y = -30;
    this.addChild(this.ui);

    this.fishView.onclick = (event) => {
      if (this.showLabel == true) {
        this.showLabel = false
        this.ui.visible = false;
      } else {
        this.showLabel = true
        this.ui.visible = true;
      }
    }

  }

  update(ticker, time) {
    if (this._sleepCutoff > this._sleepTime) {
      this._sleeping = (time > this._sleepTime && time < this._sleepCutoff)
    } else if (this._sleepTime > this._sleepCutoff) {
      this._sleeping = (time > this._sleepTime || time < this._sleepCutoff)
    }

    if (this._sleeping) {
      this.y = this.y + Math.sin(Date.now() / (500 * this.offset)) * 0.4
    } else {

      const flip = Math.random()
      const limit = 1 / (10000 / ticker.deltaMS) * this._anxiety

      if (flip < limit) {
        this._xdirection = this._xdirection * -1
        this.fishView.scale.x = this.fishView.scale.x * -1
      }

      this.y = this.y + Math.sin(Date.now() / (500 * this.offset)) * 0.4

      this.x += this._speed * this._xdirection;

      // wrap around the screen
      const padding = this.fishView.width / 2;
      const width = window.innerWidth;

      if (this.x > width + padding) {
        this.x = 0 - padding;
        this.y = Math.random() * (window.innerHeight - this.fishView.height / 2)
      }
      if (this.x < 0 - padding) {
        this.x = width + padding;
        this.y = Math.random() * (window.innerHeight - this.fishView.height / 2)
      }
    }
  }
}
