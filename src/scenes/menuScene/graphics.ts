import { Config } from '~/config'
import { Difficulty } from '~/models'
import { MenuScene } from './menuScene'


export class DifficultyGraphics extends Phaser.GameObjects.Container {
    scene: MenuScene
    background: Phaser.GameObjects.Graphics
    image: Phaser.GameObjects.Image
    name: Difficulty
    
    constructor(
        scene: MenuScene,
        name: Difficulty,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        backgroundColor: number
    ) {
        super(scene, x, y)
        this.name = name
        this.background = scene.add.graphics()
        this.background.fillStyle(backgroundColor)
        this.background.fillRect(0, 0, width, height)
        this.background.setAlpha(0)
        this.image = scene.add
            .image(2, 2, texture, frame)
            .setOrigin(0, 0)
            .setDisplaySize(width - 4, height - 4)
            .setSize(width - 4, height - 4)
        this.add([this.background, this.image])
    }

    selectDifficulty() {
        this.scene.difficultiesGraphics.forEach((icon: DifficultyGraphics) => {
            icon.background.setAlpha(0)
        })
        this.background.setAlpha(1)

    }
}

export class EntryGrahpics extends Phaser.GameObjects.Container {
    scene: MenuScene
    text: Phaser.GameObjects.Text
    image: Phaser.GameObjects.Image
    numero: number
    
    constructor(
        scene: MenuScene,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        numero: number
    ) {
        super(scene, x, y)
        this.numero = numero
        this.image = scene.add
            .image(0, 0, texture, frame)
            .setOrigin(0, 0)
            .setSize(width, height)
            .setDisplaySize(width, height)
        this.text = scene.add.text(0, 0, `${this.numero}`, Config.scenes.menu.styles.numero)
        Phaser.Display.Align.In.Center(this.text, this.image)
        this.add([this.image, this.text])
    }

    setNumero(numero: number) {
        this.numero = numero
        this.text.setText(`${numero}`)
        return this
    }
}


export class EntryGraphicsHelper extends Phaser.GameObjects.Container {
    scene: Phaser.Scene
    text: Phaser.GameObjects.Text
    image: Phaser.GameObjects.Image
    numero: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        numero: number
    ) {
        super(scene, x, y)
        this.numero = numero
        this.image = scene.add
            .image(0, 0, texture, frame)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(width, height)
            .setSize(width, height)
        this.text = scene.add.text(0, 0, `${this.numero}`, Config.scenes.menu.styles.helper)
        Phaser.Display.Align.In.Center(this.text, this.image)
        this.add([this.image, this.text])
    }

    setNumero(numero: number) {
        this.numero = numero
        this.text.setText(`${numero}`)
        return this
    }

    switchNumber() {
        console.log('switch')
    }
}
