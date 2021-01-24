import { Config } from "~/config"
import { GameScene } from "~/scenes/games"


export class TutorialHelperPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container
    public background: Phaser.GameObjects.Graphics
    public text: Phaser.GameObjects.Text

    
    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    create() {
        this.initBackground()
        this.initText()
        this.initContainer()
        this.setPosition()
    }


    initBackground() {
        const width = Config.panels.tutorial.width
        const height = Config.panels.tutorial.height
        this.background = this.scene.add.graphics({x: 0, y: 0})
            .fillStyle(0x222222, 0.5)
            .fillRoundedRect(6, 6, width, height, 16)
            .fillStyle(0xffffff, 1)
            .lineStyle(4, 0x565656, 1)
            .strokeRoundedRect(0, 0, width, height, 16)
            .fillRoundedRect(0, 0, width, height, 16)
    }

    
    initText() {
        this.text = this.scene.add.text(0, 0, 'default', Config.panels.tutorial.styles.text)
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [
            this.background, this.text
        ])
    }

    setText(text: string) {
        this.text.setText(text)
    }
    
    setPosition() {
        this.container.setPosition(
            this.scene.scale.width / 2 - Config.panels.board.width / 2,
            // this.scene.scale.height / 2 - Config.panels.board.height / 2 + Config.panels.board.height,
            this.scene.scale.height / 2 + Config.board.height / 2 + 20 ,
        )
    }

    
    
}

