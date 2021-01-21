import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"

export class GameOverScene extends Phaser.Scene {
    public isWin: boolean
    public gameScene: GameScene
    
    init() {
        this.isWin = false
        this.gameScene = this.scene.get(Config.scenes.keys.game) as GameScene
        this.events.on('wake', () => {
            this.showMenu()
        })
    }

    create() {
        
    }


}
