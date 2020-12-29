import { Config } from "~/config"
import { Difficulty, GameConfig, GameInfo } from "~/models"


function difficultyToGameInfo(difficulty: Difficulty): GameInfo {
    let gameInfo: GameInfo
    switch(difficulty) {
        case 'easy':
            gameInfo = {
                quota: 20,
                timer: 60,
                turn: 15
            }
        case 'medium':
            gameInfo = {
                quota: 50,
                timer: 45,
                turn: 20
            }
        case 'hard':
            gameInfo = {
                quota: 100,
                timer: 30,
                turn: 20
            }
    }
    return gameInfo
}


export class GameScene extends Phaser.Scene {
    public maxTurn: number
    public maxTime: number
    public maxQuota: number
    public turn = 0
    public timer = 0
    public quota = 1
    
    
    constructor() {
        super({ key: Config.scenes.keys.game })
    }

    init(gameConfig: GameConfig) {
        const initialGameInfo = difficultyToGameInfo(gameConfig.difficulty)
        this.maxTime = initialGameInfo.timer
        this.maxTurn = initialGameInfo.turn
        this.maxQuota = initialGameInfo.quota
    }

    create() {
        
    }
}
