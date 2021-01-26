import { Config } from '~/config'

export class TutorialHelperPanel {
    public scene: Phaser.Scene
    public container: Phaser.GameObjects.Container
    public background: Phaser.GameObjects.Image
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

        this.background = this.scene.add
            .image(0, 0, Config.packer.name, Config.packer.bannerModern)
            .setOrigin(0, 0)
            .setSize(Config.panels.tutorial.width, Config.panels.tutorial.height)
            .setDisplaySize(Config.panels.tutorial.width, Config.panels.tutorial.height)
    }

    initText() {
        this.text = this.scene.add.text(
            Config.panels.tutorial.paddingX,
            Config.panels.tutorial.paddingY,
            'default',
            Config.panels.tutorial.styles.text
        )
    }

    initContainer() {
        this.container = this.scene.add.container(0, 0, [this.background, this.text])
    }

    setText(text: string) {
        this.text.setText(text)
    }

    setPosition() {
        this.container.setPosition(
            this.scene.scale.width / 2 - Config.panels.board.width / 2,
            // this.scene.scale.height / 2 - Config.panels.board.height / 2 + Config.panels.board.height,
            this.scene.scale.height / 2 + Config.board.height / 2 + 20
        )
    }
}
