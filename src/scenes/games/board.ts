import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'

export class Board {
    public scene: Phaser.Scene
    public coinsContainer: Phaser.GameObjects.Container
    public entriesContainer: Phaser.GameObjects.Container
    public container: Phaser.GameObjects.Container
    public sphereGraphics: CoinGraphics
    public bordersGraphics: Array<CoinGraphics>
    public entriesGraphics: Array<CoinGraphics>
    public background: Phaser.GameObjects.TileSprite
    public handleClickedBorder: (index: number) => void 
    public handleClickedEntry: (index: number) => void 

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.handleClickedBorder = () => {}
        this.handleClickedEntry = () => {}
    }

    create() {
        this.setSphereGraphics()
        this.setCoinGraphicsAndContainer()
        this.setEntriesGraphicsAndContainer()
        this.setBoardContainer()
    }


    attachClickBorder(handleClickBorder: (index: number) => void ): this {
        this.handleClickedBorder = handleClickBorder.bind(this.scene)
        return this
    }
    
    attachClickEntry(handleClickEntry: (index: number) => void): this {
        this.handleClickedEntry = handleClickEntry.bind(this.scene)
        return this
    }

    setSphereGraphics() {
        this.sphereGraphics = this.scene.add.coin(
            Config.board.borderPadding +
                Config.board.borderSize +
                Config.board.entrySize * 0.5 +
                4,
            Config.board.borderPadding +
                Config.board.borderSize +
                Config.board.entrySize * 0.5 +
                6,
            Config.board.sphereSize,
            Config.board.sphereSize,
            Config.packer.name,
            Config.packer.coinSphere,
            0
        )
    }

    setCoinGraphicsAndContainer() {
        const directions = [
            [0, 0],
            [1, 0],
            [1, 0],
            [1, 0],
            [0, 1],
            [0, 1],
            [0, 1],
            [-1, 0],
            [-1, 0],
            [-1, 0],
            [0, -1],
            [0, -1],
        ]

        let currentPosition = [0, 0]
        this.bordersGraphics = [...Array(12).keys()].map((index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX +
                directionX * (Config.board.borderSize + Config.board.borderPadding)
            const newPositionY =
                positionY +
                directionY * (Config.board.borderSize + Config.board.borderPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.board.borderSize,
                Config.board.borderSize,
                Config.packer.name,
                Config.packer.coinBorder,
                0
            ) as CoinGraphics
            coin.background
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(
                    Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                    () => this.handleClickedBorder(index),
                    this
                )
            return coin
        })
        this.coinsContainer = this.scene.add.container(0, 0, this.bordersGraphics)
    }

    setEntriesGraphicsAndContainer() {
        const directions = [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 0],
        ]

        let currentPosition = [0, 0]
        this.entriesGraphics = [...Array(4).keys()].map((index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX +
                directionX * (Config.board.entrySize + Config.board.entryPadding)
            const newPositionY =
                positionY +
                directionY * (Config.board.entrySize + Config.board.entryPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.board.entrySize,
                Config.board.entrySize,
                Config.packer.name,
                Config.packer.coinEntry,
                0
            ) as CoinGraphics
            coin.background
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(
                    Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
                    () => this.handleClickedEntry(index),
                    this
                )

            return coin
        })
        this.entriesContainer = this.scene.add
            .container(0, 0, this.entriesGraphics)
            .setPosition(
                Config.board.entrySize + Config.board.entryPadding,
                Config.board.entrySize + Config.board.entryPadding
            )
    }

    setBoardContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.coinsContainer,
            this.entriesContainer,
            this.sphereGraphics,
        ])
        this.setPosition()
    }

    setPosition() {
        this.container.setPosition(
            this.scene.scale.width / 2 -
                Config.board.width / 2 +
                Config.board.borderSize / 2,
            this.scene.scale.height / 2 -
                Config.board.height / 2 +
                Config.board.borderSize / 2
        )
    }
}
