import { EventObject, Interpreter } from 'xstate'
import { buildMenuService, MenuContext, EVENT as EVENT_MENU } from '~/scenes/menuScene/menuStateMachine'
import { Config } from '~/config'
import { Difficulty } from '~/models'
import { ButtonContainer } from '~/ui/buttonContainer'
import { DifficultyGraphics, EntryGrahpics, EntryGraphicsHelper } from '~/scenes/menuScene/graphics'

export class MenuScene extends Phaser.Scene {
    background: Phaser.GameObjects.Image
    backgroundContainer: Phaser.GameObjects.TileSprite
    banner: Phaser.GameObjects.Container
    buttonPlay: ButtonContainer
    buttonTutorial: ButtonContainer
    currentDifficulty: Difficulty
    currentEntries: Array<number>
    difficultiesContainer: Phaser.GameObjects.Container
    difficultiesGraphics: Array<DifficultyGraphics>
    entriesGraphics: Array<EntryGrahpics>
    entriesHelperGraphics: Array<EntryGraphicsHelper>
    entriesContainer: Phaser.GameObjects.Container
    entriesHelpContainer: Phaser.GameObjects.Container
    mainContainer: Phaser.GameObjects.Container
    selectedEntry: EntryGrahpics
    selectedEntryIndex: number
    stateService: Interpreter<
        MenuContext,
        any,
        EventObject,
        {
            value: any
            context: MenuContext
        }
    >

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
        this.currentEntries = [1, 2, 3, 4]
        const parsedResult = window.localStorage.getItem('entries')
        if (parsedResult) {
            this.currentEntries = JSON.parse(parsedResult)
        }

        this.stateService = buildMenuService(this)
        this.stateService.start()

        if (Config.scenes.menu.logState) {
            this.stateService.onTransition((state) => {
                console.log(state)
            })
        }
        if (Config.scenes.skip.menu) {
            this.stateService.send(EVENT_MENU.PLAY)
        }
        this.scene.launch(Config.scenes.keys.entriesSelection)
        this.scene.sleep(Config.scenes.keys.entriesSelection)

        this.events.on('wake', () => {
            this.tweens.add({
                ...Config.scenes.menu.tweens.camera.in,
                targets: this.cameras.main,
                callbackScope: this,
            })
        })
    }

    create() {
        this.setBackground()
        this.setBackgroundContainer()
        this.setBanner()
        this.setDifficultiesContainer()
        this.setHelpEntriesContainer()
        this.setEntriesContainer()
        this.setButtonPlay()
        this.setButtonTutorial()

        this.mainContainer = this.add
            .container(0, 0, [
                this.backgroundContainer.setOrigin(0.5, 0),
                this.banner,
                this.entriesContainer.setPosition(
                    Config.scenes.menu.entriesContainer.x,
                    Config.scenes.menu.entriesContainer.y
                ),
                this.difficultiesContainer.setPosition(
                    Config.scenes.menu.difficultiesContainer.x,
                    Config.scenes.menu.difficultiesContainer.y
                ),
                this.buttonPlay.setPosition(0, 400),
                this.buttonTutorial.setPosition(0, 500),
            ])
            .setSize(600, 600)
            .setDisplaySize(600, 600)
            .setPosition(this.scale.width / 2, this.scale.height / 2 - 600 / 2)

        const difficultyIcon = this.difficultiesGraphics.find(
            (icon) => icon.name === this.currentDifficulty
        ) as DifficultyGraphics
        this.handleDifficultySelected(difficultyIcon)
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
            .text(0, 2, 'Spherebreak', Config.scenes.menu.styles.coin)
            .setOrigin(0.5, 0.5)
            .setScale(2.4, 2.4)

        this.banner = this.add.container(0, 0, [imageBanner, text])
    }

    setDifficultiesContainer() {
        const text = this.add.text(
            Config.scenes.menu.difficulties.textLeftPadding,
            0,
            'Difficulty',
            Config.scenes.menu.styles.coin
        )
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
                x * (Config.scenes.menu.difficulties.width + Config.scenes.menu.difficulties.xPadding),
                y * (Config.scenes.menu.difficulties.height + Config.scenes.menu.difficulties.yPadding) +
                    Config.scenes.menu.difficulties.textBottomPadding,
                Config.scenes.menu.difficulties.width,
                Config.scenes.menu.difficulties.height,
                Config.packer.name,
                imageToIndex[index],
                0x00ff00
            )
            entry.image
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                    this.stateService.send(EVENT_MENU.SELECT_DIFFICULTY, {
                        value: entry,
                    })
                })
            this.difficultiesGraphics.push(entry)
        }
        this.difficultiesContainer = this.add.container(0, 0, [text, ...this.difficultiesGraphics])
    }

    setEntriesContainer() {
        const text = this.add
            .text(Config.scenes.menu.entries.textLeftPadding, 0, 'Coins', Config.scenes.menu.styles.coin)
            .setOrigin(0, 0)

        this.entriesGraphics = []
        for (const index of Array(4).keys()) {
            const x = index % 2
            const y = Math.floor(index / 2)
            const entry = new EntryGrahpics(
                this,
                x * (Config.scenes.menu.entries.width + Config.scenes.menu.entries.xPadding),
                y * (Config.scenes.menu.entries.height + Config.scenes.menu.entries.yPadding) +
                    Config.scenes.menu.entries.textBottomPadding,
                Config.scenes.menu.entries.width,
                Config.scenes.menu.entries.height,
                Config.packer.name,
                Config.packer.coinEntry,
                this.currentEntries[index]
            )
            entry.image.setInteractive({ cursor: 'pointer', pixelPerfect: true }).on(
                Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                () => {
                    this.stateService.send(EVENT_MENU.SELECT_ENTRIES, { value: { entry, index } })
                },
                this
            )
            this.entriesGraphics.push(entry)
        }

        this.entriesContainer = this.add.container(0, 0, [
            text,
            ...this.entriesGraphics,
            this.entriesHelpContainer,
        ])
    }

    setHelpEntriesContainer() {
        this.entriesHelperGraphics = []
        for (const index of Array(9).keys()) {
            const x = index % 3
            const y = Math.floor(index / 3)
            const entryHelper = new EntryGraphicsHelper(
                this,
                (x - 1) * Config.scenes.menu.helperEntries.width,
                (y - 1) * Config.scenes.menu.helperEntries.height,
                Config.scenes.menu.helperEntries.width,
                Config.scenes.menu.helperEntries.height,
                Config.packer.name,
                Config.packer.coinBorder,
                index + 1
            )
            entryHelper.image
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                    this.stateService.send(EVENT_MENU.SELECT_ENTRY, { value: entryHelper })
                    // this.handleEntrySelected(entryHelper)
                })
            entryHelper.image.setInteractive({ enabled: false })
            this.entriesHelperGraphics.push(entryHelper)
        }
        this.entriesHelpContainer = this.add.container(0, 0, this.entriesHelperGraphics)
        this.entriesHelpContainer.setActive(false).setVisible(false)
    }

    setButtonPlay() {
        this.buttonPlay = this.add
            .buttonContainer(0, 0, Config.packer.name, Config.packer.menuButton, 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Play')
            .setTextStyle(Config.scenes.menu.styles.button)

        this.buttonPlay.button.setScale(1.6, 1)
        this.buttonPlay.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.stateService.send(EVENT_MENU.PLAY)
        })
    }

    setButtonTutorial() {
        this.buttonTutorial = this.add
            .buttonContainer(0, 0, Config.packer.name, Config.packer.menuButton, 0xdddddd)
            .setUpTint(0xcccccc)
            .setOverTint(0xeeeeee)
            .setDownTint(0xf8f8f8)
            .setScale(2)
            .setText('Tutorial')
            .setTextStyle(Config.scenes.menu.styles.button)
        this.buttonTutorial.button.setScale(1.6, 1)
        this.buttonTutorial.button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.stateService.send(EVENT_MENU.TUTORIAL)
        })
    }

    fromMenuToEntriesSelection() {
        this.tweens.add({
            ...Config.scenes.menu.tweens.camera.out,
            targets: this.cameras.main,
            onComplete: () => {
                this.scene.pause(Config.scenes.keys.menu)
                this.scene.wake(Config.scenes.keys.entriesSelection, this)
            },
        })
    }

    fromEntriesToSelectionToMenu() {
        this.scene.wake(Config.scenes.keys.menu)
        this.scene.sleep(Config.scenes.keys.entriesSelection)
    }

    handleTutorial() {
        console.log('tutorial')
    }

    handlePlay() {
        window.gdsdk.showAd()
        this.saveState()
        this.scene.start(Config.scenes.keys.game, {
            difficulty: this.currentDifficulty,
            entries: this.currentEntries,
        })
        this.scene.launch(Config.scenes.keys.gamePause)
        this.scene.sleep(Config.scenes.keys.gamePause)
    }

    handleDifficultySelected(graphic: DifficultyGraphics) {
        this.currentDifficulty = graphic.name
        graphic.selectDifficulty()
    }

    handleEntriesSelected(graphic: EntryGrahpics, index: number) {
        this.selectedEntry = graphic
        this.selectedEntryIndex = index
        this.fromMenuToEntriesSelection()
    }

    handleEntrySelected(graphic: EntryGraphicsHelper) {
        const numbersToExclude = this.entriesGraphics.map((graphic) => {
            return graphic.numero
        })
        this.currentEntries[this.selectedEntryIndex] = graphic.numero

        if (!numbersToExclude.find((exclude) => exclude === graphic.numero)) {
            this.entriesHelpContainer.setVisible(false).setActive(false)
            this.selectedEntry.setNumero(graphic.numero)
        }
        this.fromEntriesToSelectionToMenu()
    }

    saveState() {
        localStorage.setItem('difficulty', this.currentDifficulty)
        localStorage.setItem('entries', JSON.stringify(this.currentEntries))
    }
}
