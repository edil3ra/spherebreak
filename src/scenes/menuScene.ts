import { Config } from '~/config'
import { Difficulty } from '~/models'
import { ButtonContainer } from '~/ui/buttonContainer'

class DifficultyGraphics extends Phaser.GameObjects.Container {
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
        this.scene.difficultiesGraphics.forEach((icon: DifficultyGraphics) => {
            icon.background.setAlpha(0)
        })
        this.background.setAlpha(1)
        localStorage.setItem('difficulty', this.name)
    }
}


const numeroStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '40px',
    color: 'white',
    fontStyle: 'bold',
}


class EntryGrahpics extends Phaser.GameObjects.Container {
    scene: MenuScene
    text: Phaser.GameObjects.Text
    background: Phaser.GameObjects.Image

    constructor(
        scene: MenuScene,
        x: number,
        y: number,
        texture: string,
        frame: string,
        numero: string
    ) {
        super(scene, x, y)
        this.background = scene.add.image(0, 0, texture, frame).setOrigin(0, 0)
        this.text = scene.add.text(0, 0, numero, numeroStyle)
        Phaser.Display.Align.In.Center(this.text, this.background)
        this.add([this.background, this.text])
    }

    setText(text: number) {
        this.text.setText(`${text}`)
        return this
    }
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
        this.setButtonPlay()
        this.setButtonTutorial()
        this.setDifficultiesContainer()
        this.setEntriesContainer()

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
        this.difficultiesGraphics = [
            new DifficultyGraphics(
                this,
                'easy',
                0,
                0,
                Config.packer.name,
                Config.packer.difficulties.easy,
                0x00ff00
            ),
            new DifficultyGraphics(
                this,
                'medium',
                60,
                0,
                Config.packer.name,
                Config.packer.difficulties.medium,
                0x00ff00
            ),
            new DifficultyGraphics(
                this,
                'hard',
                120,
                0,
                Config.packer.name,
                Config.packer.difficulties.hard,
                0x00ff00
            ),
            new DifficultyGraphics(
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
            .container(-120, 180, this.difficultiesGraphics)
            .setSize(500, 500)
            .setDisplaySize(500, 500)
    }

    setEntriesContainer() {
        this.entriesGraphics = [
            new EntryGrahpics(this, 0, 0, Config.packer.name, Config.packer.coinEntry, '1'),
            new EntryGrahpics(this, 100, 0, Config.packer.name, Config.packer.coinEntry, '1'),
            new EntryGrahpics(this, 100, 100, Config.packer.name, Config.packer.coinEntry, '1'),
            new EntryGrahpics(this, 0, 100, Config.packer.name, Config.packer.coinEntry, '1'),

        ]
        this.entriesContainer = this.add
            .container(100, 100, this.entriesGraphics)
        
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
