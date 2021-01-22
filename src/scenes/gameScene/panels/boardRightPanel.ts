import { Config } from "~/config"
import { GameScene } from "~/scenes/gameScene"


export class BoardRightPanel {
    public scene: GameScene
    public container: Phaser.GameObjects.Container
    public comboMultipleText: Phaser.GameObjects.Text
    public comboCountText: Phaser.GameObjects.Text
    
    
    constructor(scene: GameScene) {
        this.scene = scene
    }

    public create() {
        this.initComboMultipleText()
        this.initComboCountText()
        this.initContainer()
    }


    initComboMultipleText() {
        this.comboMultipleText = this.scene.add.text(0, 0, '')
            .setStyle(Config.scenes.game.boardPanel.textStyle)
    }

    initComboCountText() {
        this.comboCountText = this.scene.add.text(0, 20, '')
            .setStyle(Config.scenes.game.boardPanel.textStyle)
    }

    setTComboMultipleText(comboMultple: number, comboMultipleGoal: number | null) {
        this.comboMultipleText.setText(`Multiple     ${comboMultple}   ->   ${comboMultipleGoal || '-'}`)
    }
    
    setTComboCountText(comboCount: number, comboCountGoal: number | null) {
        this.comboCountText.setText(`Count         ${comboCount}   ->   ${comboCountGoal || '-'}`)
    }


    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.comboMultipleText,
            this.comboCountText,
        ])
    }
}

