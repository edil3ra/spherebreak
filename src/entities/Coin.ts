import { CoinState } from '~/models'

interface Icoin {
    setFrame(frame: string): this
    setText(text: number): this
}

const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '40px',
    color: 'white',
    fontStyle: 'bold',
}

export class Coin extends Phaser.GameObjects.Container implements Icoin {
    public text: Phaser.GameObjects.Text
    public background: Phaser.GameObjects.Image
    public state: CoinState
    public tweenFlipping: Phaser.Tweens.Tween
    
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
        this.state = 'alive'
        this.background = scene.add.image(0, 0, frame).setOrigin(0.5, 0.5)
        this.text = scene.add.text(0, 0, numero, numeroStyle)

        this.background.setDisplaySize(width, height)
        this.background.setSize(width, height)
        Phaser.Display.Align.In.Center(this.text, this.background)

        this.add(this.background)
        this.add(this.text)

        this.tweenFlipping = this.scene.tweens.add({
            targets: this,
            scaleX: 0.25,
            scaleY: 0.5,
            ease: 'Sine.easeInOut',
            duration: 200,
            repeat: -1,
            yoyo: true,
            paused: true
        })
        
    }

    setFrame(frame: string) {
        this.background.setFrame(frame)
        return this
    }

    setText(text: number) {
        this.text.setText(`${text}`)
        return this
    }

    setState(state: CoinState): this {
        this.state = state
        switch (this.state) {
            case "alive":
                this.displayAlive()
                break
            case "dead":
                this.displayDead()
                break
            case "active":
                this.displayActive()
                break
        }
        return this
    }

    displayActive() {
        this.tweenFlipping.play()
    }

    displayDead() {
        this.tweenFlipping.pause()
        this.setAlpha(0)
    }

    displayAlive() {
        this.tweenFlipping.pause()
    }


    
}
