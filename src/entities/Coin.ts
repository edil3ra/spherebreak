interface Icoin {
    setFrame(frame: string): this
    setNumero(text: string): this
}

const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '40px',
    color: 'white',
    fontStyle: 'bold',
}

export class Coin extends Phaser.GameObjects.Container implements Icoin {
    public numero: Phaser.GameObjects.Text
    public background: Phaser.GameObjects.Image

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        frame: string,
        numero: string
    ) {
        super(scene, x, y)
        this.background = scene.add.image(0, 0, frame).setOrigin(0, 0)
        this.numero = scene.add.text(0, 0, numero, numeroStyle)

        this.background.setDisplaySize(width, height)
        this.background.setSize(width, height)
        Phaser.Display.Align.In.Center(this.numero, this.background)

        this.add(this.background)
        this.add(this.numero)
    }

    setFrame(frame: string) {
        this.background.setFrame(frame)
        return this
    }

    setNumero(text: string) {
        this.numero.setText(text)
        return this
    }
}
