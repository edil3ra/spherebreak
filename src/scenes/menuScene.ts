import { Config } from '~/config'
import { ButtonContainer } from '~/ui/buttonContainer'

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: Config.scenes.keys.menu })
    }
    public background: Phaser.GameObjects.Image
    public container: Phaser.GameObjects.Container
    public backgroundContainer: Phaser.GameObjects.TileSprite
    public buttonPlay: ButtonContainer
    public buttonTutorial: ButtonContainer
    public banner: Phaser.GameObjects.Container

    init() {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.container.setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)
            },
            false
        )
        if (Config.scenes.skip.menu) {
            this.handlePlay()
        }
    }

    create() {
        this.setBackground()
        this.setBackgroundContainer()
        this.setBanner()
        this.setButtonPlay()
        this.setButtonTutorial()
        this.container = this.add
            .container(0, 0, [this.backgroundContainer, this.banner, this.buttonPlay, this.buttonTutorial])
            .setSize(600, 600)
            .setDisplaySize(600, 600)
            .setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)
    }

    public setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    public setBackgroundContainer() {
        this.backgroundContainer = this.add.tileSprite(
            0,
            0,
            600,
            600,
            Config.packer.name,
            Config.packer.pattern
        ).setOrigin(0.5, 0)
    }

    public setBanner() {
        const imageBanner = this.add.image(0, 0, Config.packer.name, Config.packer.bannerHanging)

        const text = this.add
            .text(0, 2, 'Spherebreak', Config.scenes.menu.style)
            .setOrigin(0.5, 0.5)
            .setScale(2.4, 2.4)

        this.banner = this.add.container(0, 0, [imageBanner, text])
    }

    public setButtonPlay() {
        this.buttonPlay = this.add
            .buttonContainer(0, 120, Config.packer.name, Config.packer.menuButton, 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Play')
            .setTextStyle(Config.scenes.menu.style)

        this.buttonPlay.button.setScale(1.6, 1)
        this.buttonPlay.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlay.bind(this))
    }

    public setButtonTutorial() {
        this.buttonTutorial = this.add
            .buttonContainer(0, 220, Config.packer.name, Config.packer.menuButton, 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Tutorial')
            .setTextStyle(Config.scenes.menu.style)
        this.buttonTutorial.button.setScale(1.6, 1)
        this.buttonTutorial.button.on(
            Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
            this.handleTutorial.bind(this)
        )
    }

    public handleTutorial(pointer: Phaser.Input.Pointer) {
        console.log('Tutorial')
    }

    public handlePlay() {
        window.gdsdk.showAd()
        this.scene.start(Config.scenes.keys.game, { difficulty: 'easy' })
        this.scene.launch(Config.scenes.keys.gamePause)
        this.scene.sleep(Config.scenes.keys.gamePause)
    }
}
