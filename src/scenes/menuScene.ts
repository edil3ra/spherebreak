import { ButtonContainer } from '~/ui/buttonContainer'


const uiConfigStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '18px',
    color: 'white',
    fontStyle: 'bold',
}

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' })
    }
    public background: Phaser.GameObjects.Image
    public container: Phaser.GameObjects.Container
    public buttonPlay: ButtonContainer
    public buttonTutorial: ButtonContainer
    public banner: Phaser.GameObjects.Container

    init() {
        window.addEventListener('resize', () => {
            this.background.setDisplaySize(this.scale.width, this.scale.height)
            this.background.setPosition(0, 0)
            this.container.setPosition(100, 100)
        }, false)

    }
    
    create() {
        this.setBackground()
        this.setBanner()
        this.setButtonPlay()
        this.setButtonTutorial()
        this.container = this.add.container(
            0, 0, [this.banner, this.buttonPlay, this.buttonTutorial]
        ).setPosition(this.scale.width / 2, 100)
    }

    public setBackground() {
        this.background = this.add
            .image(0, 0, 'menuBackground')
            .setOrigin(0, 0)
            // .setDisplaySize(this.scale.width, this.scale.height)
    }

    public setBanner() {
        const imageBanner = this.add.image(0, 0, 'b2')

        const text = this.add
            .text(0, 0, 'Spherebreak', uiConfigStyle)
            .setOrigin(0.5, 0.5)
            .setScale(2.4, 2.4)

        this.banner = this.add.container(0, 0, [imageBanner, text])
    }

    public setButtonPlay() {
        this.buttonPlay = this.add
            .buttonContainer(0, 120, 'menuButton', 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Play')
            .setTextStyle(uiConfigStyle)

        this.buttonPlay.button.setScale(1.6, 1)
        this.buttonPlay.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlay.bind(this))
    }

    public setButtonTutorial() {
        this.buttonTutorial = this.add
            .buttonContainer(0, 220, 'menuButton', 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Tutorial')
            .setTextStyle(uiConfigStyle)
        this.buttonTutorial.button.setScale(1.6, 1)
        this.buttonTutorial.button.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            this.handleTutorial.bind(this)
        )
    }

    public handleTutorial(pointer: Phaser.Input.Pointer) {
        console.log('Tutorial')
    }

    public handlePlay(pointer: Phaser.Input.Pointer) {
        window.gdsdk.showAd()
        this.scene.start('game', { difficulty: 'easy' })
    }
}
