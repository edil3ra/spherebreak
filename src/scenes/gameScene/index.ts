import { Config } from '~/config'
import { Difficulty, GameConfig, GameInfo } from '~/models'
import { Board } from '~/scenes/gameScene/board'
import { BoardGame } from './boardGame'

function difficultyToGameInfo(difficulty: Difficulty): GameInfo {
    let gameInfo: GameInfo
    switch (difficulty) {
        case 'easy':
            gameInfo = {
                quota: 20,
                timer: 60,
                turn: 15,
            }
        case 'medium':
            gameInfo = {
                quota: 50,
                timer: 45,
                turn: 20,
            }
        case 'hard':
            gameInfo = {
                quota: 100,
                timer: 30,
                turn: 20,
            }
    }
    return gameInfo
}

export class GameScene extends Phaser.Scene {
    public maxTurn: number
    public maxTimer: number
    public maxQuota: number
    public turn = 0
    public timer = 0
    public quota = 1

    public coins: Array<number> = new Array(12).fill(0)
    public coinsAlive: Array<boolean> = new Array(12).fill(true)
    public coinsActive: Array<boolean> = new Array(12).fill(false)
    public entries: Array<number> = new Array(4).fill(0)
    public entriesActive: Array<boolean> = new Array(4).fill(false)
    public ratioCreateCoins = 1
    public sphere: number
    public background: Phaser.GameObjects.Image
    public board: Board
    public boardGame: BoardGame

    constructor() {
        super({ key: Config.scenes.keys.game })
    }

    init(gameConfig: GameConfig) {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
                this.board.setBoardContainerPosition()
            },
            false
        )

        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.maxTimer = initialGameInfo.timer
        this.maxTurn = initialGameInfo.turn
        this.maxQuota = initialGameInfo.quota

        this.board = new Board(this)
        this.boardGame = new BoardGame(this)
        this.setEntries()
        this.setCoinsAfterTurn()
        this.setSphereAfterTurn()
    }

    create() {
        this.setBackground()
        this.board.create()
        this.boardGame.create()
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    setEntries() {
        this.entries = [1, 2, 3, 4]
    }

    setCoinsAfterTurn() {
        this.coins = this.coins.map(() => {
            if (this.ratioCreateCoins >= Math.random()) {
                return Phaser.Math.RND.integerInRange(1, 9)
            } else {
                return 0
            }
        })
        this.ratioCreateCoins = Phaser.Math.RND.integerInRange(2, 10) / 10
    }

    setSphereAfterTurn() {
        this.sphere = Phaser.Math.RND.integerInRange(1, 9)
    }

    handleClickedCoin(index: number) {
        this.coinsActive[index] = true
        this.handleClicked()
    }

    handleClickedEntry(index: number) {
        this.entriesActive[index] = true
        this.handleClicked()
    }

    handleClicked() {
        if (this.isWinTurn()) {
            this.handleWinTurn()
        }
        if (this.isAllSphereActive()) {
            this.handleLoseTurn()
        }
    }

    get total(): number {
        const activeCoins = this.coins.filter((_coin: number, index: number) => this.coinsActive[index])
        const activeEntries = this.entries.filter((_coin: number, index: number) => this.entriesActive[index])

        return (
            activeCoins.reduce((previous: number, current: number) => previous + current, 0) +
            activeEntries.reduce((previous: number, current: number) => previous + current, 0)
        )
    }

    isWinTurn() {
        return this.total % this.sphere === 0
    }

    isAllSphereActive() {
        const hasNoCoins = this.coinsActive.every((coinActive) => coinActive)
        const hasNoEntries = this.entriesActive.every((entryActive) => entryActive)
        return hasNoCoins && hasNoEntries
    }

    handleWinTurn() {
        console.log('win turn')
    }

    handleLoseTurn() {
        console.log('lose turn')
    }

    nextTurn() {
        console.log('nex turn')
    }
}
