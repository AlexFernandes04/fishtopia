import { Container, Sprite, Graphics } from 'pixi.js';
import { CharacterUI } from './CharacterUI';
import { Speech } from './Speech';

export class Fish extends Container {
  ui;
  speech;
  _speed = 1;
  _xdirection = Math.random() > 0.5 ? 1 : -1;
  _anxiety = 0.5;
  _sleepTime = 23;
  _sleepCutoff = 23;
  _sleeping = false;
  _philosophy = "hedonism";
  _sociallvl;
  _size;
  _sizeFactor = 1;
  fishView;
  offset = Math.floor(Math.random() * (5 - 1 + 1)) + 1
  showText = false;

  constructor(texture, name, size, sociallvl, anxietylvl, speed, sleeplength, sleephabits, philosophy) {
    super();

    this.fishView = new Sprite(texture);

    this.fishView.anchor.set(0.5);

    this.addChild(this.fishView);

    if (window.innerWidth < 1024) {
      this._sizeFactor = 0.5
    } else {
      this._sizeFactor = 1
    }

    this._sociallvl = sociallvl;
    this._speed = this._speed * speed * this._sizeFactor / 2
    this._anxiety = (anxietylvl - 1) / 4
    this._sleepTime = sleephabits
    this._sleepCutoff = (this._sleepTime + sleeplength * 2) % 24
    this._philosophy = philosophy
    this._size = size


    this.fishView.scale.set(0.7 * this._xdirection * size * this._sizeFactor / 3, 0.7 * size * this._sizeFactor / 3)
    this.fishView.eventMode = 'static';

    this.ui = new CharacterUI(name);
    // this.ui.y = -30;
    this.addChild(this.ui);

    const speechText = this.generateText()
    this.speech = new Speech(speechText)
    this.speech.y = -this.height / 2
    this.speech.visible = false
    this.addChild(this.speech)

    this.fishView.onclick = (event) => {
      this.handleClick()
    }

    this.fishView.ontap = (event) => {
      this.handleClick()
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

  generateText() {

    const probability = Math.random() * 7
    if (probability < 1) {
      if (this._sociallvl == "introvert") {
        return (probability > 0.5 ? "I sure hope no one talks to me" : "Hopefully no one talks to me")
      } else if (this._sociallvl == "extrovert") {
        return (probability > 0.5 ? "Can't wait to meet all these other awesome fish" : "Can't wait to chop it up with all these other awesome fish")
      } else {
        return (probability > 0.5 ? "I am indifferent to other fish talking to me" : "Lotta fish in here")
      }
    } else if (probability < 2) {
      if (this._anxiety > 0.5) {
        return (probability > 1.5 ? "I'm freaking out" : "I'm scared")
      } else {
        return (probability > 1.5 ? "I'm not freaking out" : "Feeling pretty relaxed right now")
      }
    } else if (probability < 3) {
      if (this._size > 2) {
        return (probability > 2.5 ? "Lotta small fish in here" : "Is it just me or is everyone else way smaller than me")
      } else {
        return (probability > 2.5 ? "Lotta big fish in here" : "Is it just me or is everyone else way bigger than me")
      }
    } else {
      if (this._philosophy == "stoicism") {
        const thoughts = ["I must not waste time by just floating around aimlessly", "It is not the fish who has too little, but the fish who craves more, that is poor", "I believe in always being the bigger fish, morally speaking", "I can only control where I choose swim"]
        return thoughts[Math.floor(probability) - 3]
      } else if (this._philosophy == "utilitarianism") {
        const thoughts = ["I believe in the greater good of all fish", "I sure hope my swimming is not wrongly interfering with the other fish here", "Really hope all the other fish here are also happy", "The morality of my actions is determined on how it affects other fish"]
        return thoughts[Math.floor(probability) - 3]
      } else if (this._philosophy == "hedonism") {
        const thoughts = ["It really is great to be happy", "Every fish for themselves", "Good thing I'm not suffering right now", "I'm having a great time swimming so I'll probably keep doing this"]
        return thoughts[Math.floor(probability) - 3]
      } else if (this._philosophy == "existentialism") {
        const thoughts = ["My freedom to choose where to swim is causing me dread", "Am I condemned to keep swimming forever", "I believe I am not bound by any destiny in choosing where to swim", "I struggle to find meaning in my existence as a fish"]
        return thoughts[Math.floor(probability) - 3]
      } else if (this._philosophy == "nihilism") {
        const thoughts = ["There isn't even a point to swimming anywhere", "My existence is basically unknown to the rest of the universe", "I accept the meaningless in my existence as a fish", "I'm basically going to swim around for a bit and then die"]
        return thoughts[Math.floor(probability) - 3]
      } else {
        return "yep"
      }
    }
  }

  handleClick() {
    if (this.showText == true) {
      this.showText = false
      this.speech.visible = false;
    } else {
      if (this._sleeping) {
        this.speech.label.text = "zzzzzz"
        this.speech.generateBackground();
      } else {
        if (this.speech.label.text == "zzzzzz") {
          this.speech.label.text = this.generateText()
          this.speech.generateBackground();
        }
      }
      this.showText = true
      this.speech.visible = true;
    }
  }
}
