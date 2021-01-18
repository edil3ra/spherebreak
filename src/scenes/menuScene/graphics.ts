import { Difficulty } from '~/models'
import { MenuScene } from './menuScene'

const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '40px',
    color: 'white',
    fontStyle: 'bold',
}

export class DifficultyGraphics extends Phaser.GameObjects.Container {
    scene: MenuScene
    background: Phaser.GameObjects.Graphics
    image: Phaser.GameObjects.Image

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
        this.image.setInteractive({ cursor: 'pointer' }).on('pointerdown', this.selectDifficulty.bind(this))
    }

    selectDifficulty() {
        this.scene.difficultiesGraphics.forEach((icon: DifficultyGraphics) => {
            icon.background.setAlpha(0)
        })
        this.background.setAlpha(1)
        localStorage.setItem('difficulty', this.name)
    }
}

export class EntryGrahpics extends Phaser.GameObjects.Container {
    scene: MenuScene
    text: Phaser.GameObjects.Text
    image: Phaser.GameObjects.Image

    constructor(
        scene: MenuScene,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        numero: string
    ) {
        super(scene, x, y)
        this.image = scene.add
            .image(0, 0, texture, frame)
            .setOrigin(0, 0)
            .setSize(width, height)
            .setDisplaySize(width, height)
        this.text = scene.add.text(0, 0, numero, numeroStyle)
        Phaser.Display.Align.In.Center(this.text, this.image)
        this.add([this.image, this.text])
    }

    setText(text: number) {
        this.text.setText(`${text}`)
        return this
    }
}

const helperStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '20px',
    color: 'white',
    fontStyle: 'bold',
}

export class EntryGraphicsHelper extends Phaser.GameObjects.Container {
    scene: MenuScene
    text: Phaser.GameObjects.Text
    image: Phaser.GameObjects.Image

    constructor(
        scene: MenuScene,
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        numero: string
    ) {
        super(scene, x, y)
        this.image = scene.add
            .image(0, 0, texture, frame)
            .setOrigin(0, 0)
            .setDisplaySize(width, height)
            .setSize(width, height)
        this.text = scene.add.text(0, 0, numero, helperStyle)
        Phaser.Display.Align.In.Center(this.text, this.image)
        this.add([this.image, this.text])
        this.image.setInteractive({ cursor: 'pointer' }).on('pointerdown', this.switchNumber.bind(this))
    }

    setText(text: number) {
        this.text.setText(`${text}`)
        return this
    }

    switchNumber() {
        console.log('switch')
    }
}
