// description: This example demonstrates the use of RenderLayer to manage the rendering order of UI elements in a scene with multiple sprites and filters using PixiJS.
import { Application, Assets, Container, DisplacementFilter, RenderLayer, Sprite, TilingSprite } from 'pixi.js';
import { Fish } from './Fish';
import { VolumeButton } from './VolumeButton';
import { LabelButton } from "./LabelButton"
import { sound } from '@pixi/sound';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ width: 630, height: 410, antialias: true, resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);
  // move the canvas to the center of the screen
  app.canvas.style.position = 'absolute';
  app.canvas.style.top = `${window.innerHeight / 2 - app.canvas.height / 2}px`;
  app.canvas.style.left = `${window.innerWidth / 2 - app.canvas.width / 2}px`;

  const backendURL = "http://127.0.0.1:5000/database"
  const response = await fetch(backendURL);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const result = await response.json();
  const assets = []

  for (let i = 0; i < result.length; i++) {
    assets.push(`http://127.0.0.1:5000/image/${result[i][0]}.png`)
  }

  assets.push(`https://pixijs.com/assets/pond/displacement_map.png`)
  assets.push(`https://static.vecteezy.com/system/resources/thumbnails/045/850/168/small_2x/deep-sea-underwater-professional-advertising-foodgraphy-photo.jpg`)
  assets.push(`/assets/volume-on.svg`)
  assets.push(`/assets/volume-off.svg`)

  // Load textures
  await Assets.load(assets);

  const background = Sprite.from('https://static.vecteezy.com/system/resources/thumbnails/045/850/168/small_2x/deep-sea-underwater-professional-advertising-foodgraphy-photo.jpg');
  const bgAspectRatio = background.width / background.height
  const appAspectRatio = window.innerWidth / window.innerHeight

  if (bgAspectRatio < appAspectRatio) {
    console.log("Fit to width")
    background.width = innerWidth
    background.height = background.width / bgAspectRatio
  } else {
    console.log("Fit to height")
    const offset = (background.width - window.innerWidth) / 2
    background.height = window.innerHeight
    background.width = background.height * bgAspectRatio
    background.x = -offset
  }

  const pondContainer = new Container();
  pondContainer.eventMode = "static"

  pondContainer.addChild(background);

  app.stage.addChild(pondContainer);

  const displacementMap = Assets.get('https://pixijs.com/assets/pond/displacement_map.png');

  displacementMap.source.wrapMode = 'repeat';

  const displacementSprite = Sprite.from(displacementMap);
  const displacementFilter = new DisplacementFilter(displacementSprite, 30);

  pondContainer.addChild(displacementSprite);
  pondContainer.filters = [displacementFilter];

  const uiLayer = new RenderLayer();

  const fishes = [];

  for (let i = 0; i < result.length; i++) {
    const name = result[i][1]
    const size = result[i][2]
    const sociallvl = result[i][3]
    const anxietylvl = result[i][4]
    const speed = result[i][5]
    const sleeplength = result[i][6]
    const sleephabits = result[i][7]
    const philosophy = result[i][8]

    const texture = Assets.get(assets[i])

    const fish = new Fish(texture, name, size, sociallvl, anxietylvl, speed, sleeplength, sleephabits, philosophy);

    fishes.push(fish);

    pondContainer.addChild(fish);

    fish.x = Math.random() * app.canvas.width;
    fish.y = Math.random() * app.canvas.height;

    uiLayer.attach(fish.speech);
    uiLayer.attach(fish.ui);
  }

  app.stage.addChild(uiLayer);

  sound.add('music', '/assets/weirdfishes.mp3');
  sound.play('music', { loop: true });

  const volumeButton = new VolumeButton(Assets.get("/assets/volume-on.svg"), Assets.get("/assets/volume-off.svg"), sound);
  volumeButton.x = app.canvas.width - (volumeButton.width)
  volumeButton.y = window.innerHeight - (volumeButton.height)/2 - 20

  app.stage.addChild(volumeButton);

  const labelButton = new LabelButton(uiLayer)
  labelButton.x = (labelButton.width) / 1.5
  labelButton.y = window.innerHeight - (labelButton.height)/2 - 20
  app.stage.addChild(labelButton);

  labelButton.onclick = (event) => {
    if (labelButton.showLabels) {
      labelButton.text.text = "Show Names"
      fishes.forEach((fish) => fish.ui.visible = false);
    } else {
      labelButton.text.text = "Hide Names"
      fishes.forEach((fish) => fish.ui.visible = true);
    }
    labelButton.showLabels = !labelButton.showLabels
  }

  // Animate the mask
  app.ticker.add((ticker) => {
    displacementSprite.x += 0.5;
    displacementSprite.y += 0.5;

    const currentDate = new Date();
    const time = currentDate.getHours() + currentDate.getMinutes() / 60

    fishes.forEach((fish) => fish.update(ticker, time));
  });
})();