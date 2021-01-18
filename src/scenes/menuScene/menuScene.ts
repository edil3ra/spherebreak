import { Config } from '~/config'
import { Difficulty } from '~/models'
import { ButtonContainer } from '~/ui/buttonContainer'
import { DifficultyGraphics, EntryGrahpics, EntryGraphicsHelper } from '~/scenes/menuScene/graphics'

const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '30px',
    color: 'white',
    fontStyle: 'bold',
}

export class MenuScene extends Phaser.Scene {
    background: Phaser.GameObjects.Image
    backgroundContainer: Phaser.GameObjects.TileSprite
    banner: Phaser.GameObjects.Container
    buttonPlay: ButtonContainer
    buttonTutorial: ButtonContainer
    currentDifficulty: Difficulty
    difficultiesContainer: Phaser.GameObjects.Container
    difficultiesGraphics: Array<DifficultyGraphics>
    entriesContainer: Phaser.GameObjects.Container
    entriesGraphics: Array<EntryGrahpics>
    mainContainer: Phaser.GameObjects.Container
    entriesHelpContainer: Phaser.GameObjects.Container

    constructor() {
        super({ key: Config.scenes.keys.menu })
    }

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
        this.setDifficultiesContainer()
        this.setEntriesContainer()
        this.setButtonPlay()
        this.setButtonTutorial()
        this.setHelpEntriesContainer()

        this.mainContainer = this.add
            .container(0, 0, [
                this.backgroundContainer.setOrigin(0.5, 0),
                this.banner,
                this.entriesContainer.setPosition(-220, 100),
                this.difficultiesContainer.setPosition(48, 100),
                this.buttonPlay.setPosition(0, 400),
                this.buttonTutorial.setPosition(0, 500),
                this.entriesHelpContainer,
            ])
            .setSize(600, 600)
            .setDisplaySize(600, 600)
            .setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)

        const difficultyIcon = this.difficultiesGraphics.find(
            (icon) => icon.name === this.currentDifficulty
        ) as DifficultyGraphics
        difficultyIcon.selectDifficulty()
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, Config.images.background)
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    setBackgroundContainer() {
        this.backgroundContainer = this.add.tileSprite(
            0,
            0,
            600,
            600,
            Config.packer.name,
            Config.packer.pattern
        )
    }

    setBanner() {
        const imageBanner = this.add.image(0, 0, Config.packer.name, Config.packer.bannerHanging)

        const text = this.add
            .text(0, 2, 'Spherebreak', Config.scenes.menu.style)
            .setOrigin(0.5, 0.5)
            .setScale(2.4, 2.4)

        this.banner = this.add.container(0, 0, [imageBanner, text])
    }

    setDifficultiesContainer() {
        const text = this.add.text(24, 0, 'Difficulty', textStyle)
        const textOffset = 40
        const width = 80
        const height = 80
        const xOffset = 88
        const yOffset = 88
        const difficultyToIndex: Array<Difficulty> = ['easy', 'medium', 'hard', 'insane']
        const imageToIndex = [
            Config.packer.difficulties.easy,
            Config.packer.difficulties.medium,
            Config.packer.difficulties.hard,
            Config.packer.difficulties.insane,
        ]
        this.difficultiesGraphics = []

        for (const index of Array(4).keys()) {
            const x = index % 2
            const y = Math.floor(index / 2)
            const entry = new DifficultyGraphics(
                this,
                difficultyToIndex[index],
                x * xOffset,
                y * yOffset + textOffset,
                width,
                height,
                Config.packer.name,
                imageToIndex[index],
                0x00ff00
            )
            entry.image
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.onDifficultySelected(entry), this)
            this.difficultiesGraphics.push(entry)
        }
        this.difficultiesContainer = this.add.container(0, 0, [text, ...this.difficultiesGraphics])
    }

    setEntriesContainer() {
        const text = this.add.text(40, 0, 'Coins', textStyle).setOrigin(0, 0)
        const width = 80
        const height = 80
        const textOffset = 40
        const xOffset = 88
        const yOffset = 88

        this.entriesGraphics = []
        for (const index of Array(4).keys()) {
            const x = index % 2
            const y = Math.floor(index / 2)
            const entry = new EntryGrahpics(
                this,
                x * xOffset,
                y * yOffset + textOffset,
                width,
                height,
                Config.packer.name,
                Config.packer.coinEntry,
                `${index + 1}`
            )
            entry.image.setInteractive({ cursor: 'pointer', pixelPerfect: true }).on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                () => {
                    console.log('hello')
                },
                this
            )
            this.entriesGraphics.push(entry)
        }

        this.entriesContainer = this.add.container(0, 0, [text, ...this.entriesGraphics])
    }

    setHelpEntriesContainer() {
        const entriesHelper = []
        for (const index of Array(9).keys()) {
            const x = index % 3
            const y = Math.floor(index / 3)
            const helper = new EntryGraphicsHelper(
                this,
                (x - 1) * 40,
                (y - 1) * 40,
                40,
                40,
                Config.packer.name,
                Config.packer.coinEntry,
                `${index + 1}`
            )
            entriesHelper.push(helper)
        }
        this.entriesHelpContainer = this.add.container(0, 0, entriesHelper)
    }

    setButtonPlay() {
        this.buttonPlay = this.add
            .buttonContainer(0, 0, Config.packer.name, Config.packer.menuButton, 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Play')
            .setTextStyle(Config.scenes.menu.style)

        this.buttonPlay.button.setScale(1.6, 1)
        this.buttonPlay.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handlePlay.bind(this))
    }

    setButtonTutorial() {
        this.buttonTutorial = this.add
            .buttonContainer(0, 0, Config.packer.name, Config.packer.menuButton, 0xdddddd)
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

    onDifficultySelected(entry: DifficultyGraphics) {
        this.difficultiesGraphics.forEach((icon: DifficultyGraphics) => {
            icon.background.setAlpha(0)
        })
        entry.background.setAlpha(1)
        localStorage.setItem('difficulty', entry.name)
    }
}
