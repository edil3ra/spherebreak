import { Config } from '~/config'
import { CoinGraphics } from '~/entities/Coin'
import { GameScene } from '~/scenes/games'

export class Board {
    public scene: Phaser.Scene
    public coinsContainer: Phaser.GameObjects.Container
    public entriesContainer: Phaser.GameObjects.Container
    public boardContainer: Phaser.GameObjects.Container
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
        this.handleClickedBorder = handleClickBorder
        return this
    }
    
    attachClickEntry(handleClickEntry: (index: number) => void): this {
        this.handleClickedEntry = handleClickEntry
        return this
    }

    setSphereGraphics() {
        this.sphereGraphics = this.scene.add.coin(
            Config.scenes.game.board.borderPadding +
                Config.scenes.game.board.borderSize +
                Config.scenes.game.board.entrySize * 0.5 +
                4,
            Config.scenes.game.board.borderPadding +
                Config.scenes.game.board.borderSize +
                Config.scenes.game.board.entrySize * 0.5 +
                6,
            Config.scenes.game.board.sphereSize,
            Config.scenes.game.board.sphereSize,
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
                directionX * (Config.scenes.game.board.borderSize + Config.scenes.game.board.borderPadding)
            const newPositionY =
                positionY +
                directionY * (Config.scenes.game.board.borderSize + Config.scenes.game.board.borderPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.board.borderSize,
                Config.scenes.game.board.borderSize,
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
                directionX * (Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding)
            const newPositionY =
                positionY +
                directionY * (Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.board.entrySize,
                Config.scenes.game.board.entrySize,
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
                Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding,
                Config.scenes.game.board.entrySize + Config.scenes.game.board.entryPadding
            )
    }

    setBoardContainer() {
        this.boardContainer = this.scene.add.container(0, 0, [
            this.coinsContainer,
            this.entriesContainer,
            this.sphereGraphics,
        ])
        this.setBoardContainerPosition()
    }

    setBoardContainerPosition() {
        this.boardContainer.setPosition(
            this.scene.scale.width / 2 -
                Config.scenes.game.board.width / 2 +
                Config.scenes.game.board.borderSize / 2,
            this.scene.scale.height / 2 -
                Config.scenes.game.board.height / 2 +
                Config.scenes.game.board.borderSize / 2
        )
    }
}
