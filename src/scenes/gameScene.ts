import { Config } from '~/config'
import { Difficulty, GameConfig, GameInfo } from '~/models'

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
    public background: Phaser.GameObjects.Image

    constructor() {
        super({ key: Config.scenes.keys.game })
    }

    setBackground() {
        this.background = this.add
            .image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
    }

    init(gameConfig: GameConfig) {
        window.addEventListener(
            'resize',
            () => {
                this.background.setDisplaySize(window.innerWidth, window.innerHeight)
                this.background.setPosition(0, 0)
            },
            false
        )

        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.maxTimer = initialGameInfo.timer
        this.maxTurn = initialGameInfo.turn
        this.maxQuota = initialGameInfo.quota
    }

    create() {
        this.setBackground()
    }
}
