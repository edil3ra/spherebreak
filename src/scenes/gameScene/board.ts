import { Config } from "~/config"
import { Coin } from "~/entities/Coin"
import { GameScene } from "~/scenes/gameScene"



export class Board {
    public scene: GameScene
    public coinsContainer: Phaser.GameObjects.Container
    public entriesContainer: Phaser.GameObjects.Container
    public boardContainer: Phaser.GameObjects.Container
    public sphereGraphics: Coin
    public coinsGraphics: Array<Coin>
    public entriesGraphics: Array<Coin>
    
    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.setSphereGraphics()
        this.setCoinGraphicsAndContainer()
        this.setEntriesGraphicsAndContainer()
        this.setBoardContainer()        
    }


    setSphereGraphics() {
        this.sphereGraphics = this.scene.add.coin(
            Config.scenes.game.coinPadding +
                Config.scenes.game.coinSize +
                Config.scenes.game.entryPadding +
                Config.scenes.game.entrySize / 2,
            Config.scenes.game.coinPadding +
                Config.scenes.game.coinSize +
                Config.scenes.game.entryPadding +
                Config.scenes.game.entrySize / 2,
            Config.scenes.game.sphereSize,
            Config.scenes.game.sphereSize,
            'sphere',
            this.scene.data.sphere,
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
        this.coinsGraphics = this.scene.data.coins.map((numero: number, index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX + directionX * (Config.scenes.game.coinSize + Config.scenes.game.coinPadding)
            const newPositionY =
                positionY + directionY * (Config.scenes.game.coinSize + Config.scenes.game.coinPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.coinSize,
                Config.scenes.game.coinSize,
                'coin',
                numero
            ) as Coin
            coin.background
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.scene.handleClickedCoin(index), this)
            return coin
        })
        this.coinsContainer = this.scene.add.container(0, 0, this.coinsGraphics)
    }


    setEntriesGraphicsAndContainer() {
        const directions = [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 0],
        ]

        let currentPosition = [0, 0]

        this.entriesGraphics = this.scene.data.entries.map((numero: number, index: number) => {
            const [positionX, positionY] = currentPosition
            const [directionX, directionY] = directions[index]
            const newPositionX =
                positionX + directionX * (Config.scenes.game.entrySize + Config.scenes.game.entryPadding)
            const newPositionY =
                positionY + directionY * (Config.scenes.game.entrySize + Config.scenes.game.entryPadding)
            currentPosition = [newPositionX, newPositionY]
            const coin = this.scene.add.coin(
                newPositionX,
                newPositionY,
                Config.scenes.game.entrySize,
                Config.scenes.game.entrySize,
                'entry',
                numero
            ) as Coin
            coin.background
                .setInteractive({ cursor: 'pointer' })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.scene.handleClickedEntry(index), this)

            return coin
        })
        this.entriesContainer = this.scene.add
            .container(0, 0, this.entriesGraphics)
            .setPosition(
                Config.scenes.game.entrySize + Config.scenes.game.entryPadding,
                Config.scenes.game.entrySize + Config.scenes.game.entryPadding
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
            this.scene.scale.width / 2 - Config.scenes.game.boardWidth / 2,
            this.scene.scale.height / 2 - Config.scenes.game.boardHeight / 2
        )
    }
    
}
