import { Config } from '~/config'
import { Difficulty } from '~/models'
import { ButtonContainer } from '~/ui/buttonContainer'
import { DifficultyGraphics, EntryGrahpics } from '~/scenes/menuScene/graphics'

const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '30px',
    color: 'white',
    fontStyle: 'bold',
}

export class MenuScene extends Phaser.Scene {
    currentDifficulty: Difficulty
    background: Phaser.GameObjects.Image
    mainContainer: Phaser.GameObjects.Container
    backgroundContainer: Phaser.GameObjects.TileSprite
    buttonPlay: ButtonContainer
    buttonTutorial: ButtonContainer
    banner: Phaser.GameObjects.Container
    difficultiesContainer: Phaser.GameObjects.Container
    difficultiesGraphics: Array<DifficultyGraphics>
    entriesContainer: Phaser.GameObjects.Container
    entriesGraphics: Array<EntryGrahpics>

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

        this.mainContainer = this.add
            .container(0, 0, [
                this.backgroundContainer.setOrigin(0.5, 0),
                this.banner,
                this.entriesContainer.setPosition(-220, 100),
                this.difficultiesContainer.setPosition(48, 100),
                this.buttonPlay.setPosition(0, 400),
                this.buttonTutorial.setPosition(0, 500),
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
        const text = this.add.text(24, 0, 'Difficulty', numeroStyle)
        const textOffset = 40
        const xOffset = 88
        const yOffset = 88

        this.difficultiesGraphics = [
            new DifficultyGraphics(
                this,
                'easy',
                0,
                textOffset,
                Config.packer.name,
                Config.packer.difficulties.easy,
                0x00ff00
            ),
            new DifficultyGraphics(
                this,
                'medium',
                xOffset,
                textOffset,
                Config.packer.name,
                Config.packer.difficulties.medium,
                0x00ff00
            ),
            new DifficultyGraphics(
                this,
                'hard',
                xOffset,
                textOffset + yOffset,
                Config.packer.name,
                Config.packer.difficulties.hard,
                0x00ff00
            ),
            new DifficultyGraphics(
                this,
                'insane',
                0,
                textOffset + yOffset,
                Config.packer.name,
                Config.packer.difficulties.insane,
                0x00ff00
            ),
        ]
        this.difficultiesContainer = this.add.container(0, 0, [text, ...this.difficultiesGraphics])
    }

    setEntriesContainer() {
        const text = this.add.text(40, 0, 'Coins', numeroStyle).setOrigin(0, 0)
        const textOffset = 40
        const xOffset = 88
        const yOffset = 88

        this.entriesGraphics = [
            new EntryGrahpics(this, 0, textOffset, Config.packer.name, Config.packer.coinEntry, '1'),
            new EntryGrahpics(this, xOffset, textOffset, Config.packer.name, Config.packer.coinEntry, '1'),
            new EntryGrahpics(
                this,
                xOffset,
                textOffset + yOffset,
                Config.packer.name,
                Config.packer.coinEntry,
                '1'
            ),
            new EntryGrahpics(
                this,
                0,
                textOffset + yOffset,
                Config.packer.name,
                Config.packer.coinEntry,
                '1'
            ),
        ]
        this.entriesContainer = this.add.container(0, 0, [text, ...this.entriesGraphics])
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
}
