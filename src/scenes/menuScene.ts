import { Config } from '~/config'
import { Difficulty } from '~/models'
import { ButtonContainer } from '~/ui/buttonContainer'

class DifficultyIcon extends Phaser.GameObjects.Container {
    scene: MenuScene
    background: Phaser.GameObjects.Graphics
    image: Phaser.GameObjects.Image

    constructor(
        scene: MenuScene,
        name: Difficulty,
        x: number,
        y: number,
        texture: string,
        frame: string,
        backgroundColor: number
    ) {
        super(scene, x, y)
        this.name = name
        this.background = scene.add.graphics()
        this.background.fillStyle(backgroundColor)
        this.background.fillRect(0, 0, 54, 54)
        this.background.setAlpha(0)
        this.image = scene.add.image(2, 2, texture, frame).setOrigin(0, 0)
        this.add([this.background, this.image])
        this.image.setInteractive({ cursor: 'pointer' }).on('pointerdown', this.selectDifficulty.bind(this))
    }

    selectDifficulty() {
        this.scene.difficultiesIcon.forEach((icon: DifficultyIcon) => {
            icon.background.setAlpha(0)
        })
        this.background.setAlpha(1)
        localStorage.setItem('difficulty', this.name)
    }
}

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: Config.scenes.keys.menu })
    }
    currentDifficulty: Difficulty
    background: Phaser.GameObjects.Image
    mainContainer: Phaser.GameObjects.Container
    backgroundContainer: Phaser.GameObjects.TileSprite
    buttonPlay: ButtonContainer
    buttonTutorial: ButtonContainer
    banner: Phaser.GameObjects.Container
    difficultiesContainer: Phaser.GameObjects.Container
    difficultiesIcon: Array<DifficultyIcon>

    init() {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.mainContainer.setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)
            },
            false
        )

        this.currentDifficulty = (window.localStorage.getItem('difficulty') as Difficulty) || 'easy'
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
        this.setDifficultiesContainer()
        const difficultyIcon = this.difficultiesIcon.find(
            (icon) => icon.name === this.currentDifficulty
        ) as DifficultyIcon
        difficultyIcon.selectDifficulty()

        this.mainContainer = this.add
            .container(0, 0, [
                this.backgroundContainer,
                this.banner,
                this.buttonPlay,
                this.difficultiesContainer,
                this.buttonTutorial,
            ])
            .setSize(600, 600)
            .setDisplaySize(600, 600)
            .setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    setBackgroundContainer() {
        this.backgroundContainer = this.add
            .tileSprite(0, 0, 600, 600, Config.packer.name, Config.packer.pattern)
            .setOrigin(0.5, 0)
    }

    setBanner() {
        const imageBanner = this.add.image(0, 0, Config.packer.name, Config.packer.bannerHanging)

        const text = this.add
            .text(0, 2, 'Spherebreak', Config.scenes.menu.style)
            .setOrigin(0.5, 0.5)
            .setScale(2.4, 2.4)

        this.banner = this.add.container(0, 0, [imageBanner, text])
    }

    setButtonPlay() {
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

    setDifficultiesContainer() {
        this.difficultiesIcon = [
            new DifficultyIcon(
                this,
                'easy',
                0,
                0,
                Config.packer.name,
                Config.packer.difficulties.easy,
                0x00ff00
            ),
            new DifficultyIcon(
                this,
                'medium',
                60,
                0,
                Config.packer.name,
                Config.packer.difficulties.medium,
                0x00ff00
            ),
            new DifficultyIcon(
                this,
                'hard',
                120,
                0,
                Config.packer.name,
                Config.packer.difficulties.hard,
                0x00ff00
            ),
            new DifficultyIcon(
                this,
                'insane',
                180,
                0,
                Config.packer.name,
                Config.packer.difficulties.insane,
                0x00ff00
            ),
        ]
        this.difficultiesContainer = this.add
            .container(-120, 180, this.difficultiesIcon)
            .setSize(500, 500)
            .setDisplaySize(500, 500)
    }

    setButtonTutorial() {
        this.buttonTutorial = this.add
            .buttonContainer(0, 300, Config.packer.name, Config.packer.menuButton, 0xdddddd)
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

    handleTutorial(pointer: Phaser.Input.Pointer) {
        console.log('Tutorial')
    }

    handlePlay() {
        window.gdsdk.showAd()
        this.scene.start(Config.scenes.keys.game, { difficulty: 'easy' })
        this.scene.launch(Config.scenes.keys.gamePause)
        this.scene.sleep(Config.scenes.keys.gamePause)
    }
}
