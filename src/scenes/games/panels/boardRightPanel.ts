import { Config } from "~/config"


export class BoardRightPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container
    public comboMultipleText: Phaser.GameObjects.Text
    public comboCountText: Phaser.GameObjects.Text
    
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public create() {
        this.initComboMultipleText()
        this.initComboCountText()
        this.initContainer()
    }


    initComboMultipleText() {
        this.comboMultipleText = this.scene.add.text(0, 0, '')
            .setStyle(Config.panels.board.styles.text)
    }

    initComboCountText() {
        this.comboCountText = this.scene.add.text(0, 20, '')
            .setStyle(Config.panels.board.styles.text)
    }

    setComboMultipleText(comboMultple: number, comboMultipleGoal: number | null) {
        this.comboMultipleText.setText(`Multiple     ${comboMultple}   ->   ${comboMultipleGoal || '-'}`)
    }
    
    setComboCountText(comboCount: number, comboCountGoal: number | null) {
        this.comboCountText.setText(`Count         ${comboCount}   ->   ${comboCountGoal || '-'}`)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.comboMultipleText,
            this.comboCountText,
        ])
    }
}

