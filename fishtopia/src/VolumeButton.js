import { Container, Graphics, Texture, Assets, Sprite, textureBit } from 'pixi.js';
import { sound } from '@pixi/sound';

export class VolumeButton extends Container {
    muted = false;
    radius = 30;
    image
    onTexture
    offTexture

    constructor(onTexture, offTexture, sound) {
        super();

        const bg = new Graphics()
            .circle(0, 0, this.radius)
            .fill({
                color: 0xbf2477,
                alpha: 1,
            });

        this.onTexture = onTexture
        this.offTexture = offTexture

        this.image = new Sprite(this.onTexture)
        this.image.width = this.radius
        this.image.height = this.radius

        this.image.x = -this.radius/2
        this.image.y = -this.radius/2


        this.eventMode = "static"

        this.onclick = (event) => {
            if(this.muted){
                this.image.texture = this.onTexture
                sound.unmuteAll()
            } else {
                this.image.texture = this.offTexture
                sound.muteAll()
            }
            this.muted = !this.muted
        }

        this.addChild(bg);
        this.addChild(this.image)
    }
}