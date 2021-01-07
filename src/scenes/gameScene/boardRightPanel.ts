import { GameScene } from "~/scenes/gameScene"

const textConfigStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Play',
    fontSize: '14px',
    color: 'white',
    fontStyle: 'bold',
}

export class BoardRightPanel {
    public scene: GameScene
    // public background: Phaser.GameObjects.Image
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
            .setStyle(textConfigStyle)
    }

    initComboCountText() {
        this.comboCountText = this.scene.add.text(0, 20, '')
            .setStyle(textConfigStyle)
    }

    setTComboMultipleText(comboMultple: number, comboMultipleGoal: number | null) {
        if (comboMultipleGoal === null) {
            this.comboMultipleText.setText(`Combo Multiple     0`)
        } else {
            this.comboMultipleText.setText(`Combo Multiple     ${comboMultple}  ->  ${comboMultipleGoal}`)
        }
    }
    
    setTComboCountText(comboCount: number, comboCountGoal: number | null) {
        if (comboCountGoal === null) {
            this.comboCountText.setText(`Combo Count         0`)
        } else {
            this.comboCountText.setText(`Combo Count         ${comboCount}  ->  ${comboCountGoal}`)
        }
    }


    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.comboMultipleText,
            this.comboCountText,
        ])
    }
}

