import { CoinState, CoinType } from '~/models'


const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '40px',
    color: 'white',
    fontStyle: 'bold',
}

export class CoinGraphics extends Phaser.GameObjects.Container {
    public text: Phaser.GameObjects.Text
    public background: Phaser.GameObjects.Image
    public state: CoinState
    public type: CoinType
    public tweenFlipping: Phaser.Tweens.Tween
    public tweenRevive: Phaser.Tweens.Timeline
    public tweenKill: Phaser.Tweens.Timeline
    public defaultWidth: number
    public defaultHeight: number
    
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        type: CoinType,
        texture: string,
        frame: string,
        numero: string
    ) {
        super(scene, x, y)
        this.state = 'inactive'
        this.type = type
        this.defaultWidth = width
        this.defaultHeight = height
        this.background = scene.add.image(0, 0, texture, frame).setOrigin(0.5, 0.5)
        this.text = scene.add.text(0, 0, numero).setStyle(numeroStyle)
        this.background.setDisplaySize(width, height)
        this.background.setSize(width, height)
        Phaser.Display.Align.In.Center(this.text, this.background)

        this.add([this.background, this.text])

        this.tweenFlipping = this.scene.tweens.add({
            targets: this.background,
            scaleX: 0,
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
            case "inactive":
                this.displayInactive()
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

    revive() {
        this.tweenRevive = this.scene.tweens.timeline({
            targets: this,
            ease: 'Sine.easeOutIn',
            tweens: [{
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 0,
                alpha: 0
            },{
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                duration: 140,
            }],
        })
    }

    displayDead() {
        this.tweenKill = this.scene.tweens.timeline({
            targets: this,
            ease: 'Sine.easeInOut',
            tweens: [{
                scaleX: 1,
                scaleY: 1,
                duration: 0,
                alpha: 1
            },{
                scaleX: 0.2,
                scaleY: 0.2,
                alpha: 0,
                duration: 140,
            }],
        })
    }

    displayActive() {
        this.tweenFlipping.resume()
        this.background.setSize(this.defaultWidth, this.defaultHeight)
        this.background.setDisplaySize(this.defaultWidth, this.defaultHeight)
    }
    
    displayInactive() {
        this.scene.time.delayedCall(0, () => {
            this.tweenFlipping.pause()
        })            
    }
}
