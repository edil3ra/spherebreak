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

    constructor(scene: Phaser.Scene, x: number, y: number, frame: string, numero: string) {
        super(scene, x, y)
        this.background = scene.add.image(0, 0, frame)
        this.numero = scene.add.text(0, 0, numero, numeroStyle).setOrigin(0.5, 0.5)

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
