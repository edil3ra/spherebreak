import { Config } from '~/config'
import { GameScene } from '~/scenes/gameScene'
import { ButtonContainer } from '~/ui/buttonContainer'

export class GameOverScene extends Phaser.Scene {
    public gameScene: GameScene
    public container: Phaser.GameObjects.Container
    public text: Phaser.GameObjects.Text
    public buttonPlay: ButtonContainer
    public buttonBack: ButtonContainer

    constructor() {
        super({ key: Config.scenes.keys.gameOver })
    }

    init() {
        this.gameScene = this.scene.get(Config.scenes.keys.game) as GameScene
        this.events.on('wake', () => {
            this.showMenu()
        })

        window.addEventListener(
            'resize',
            () => {
                const [x, y] = this.getContainerCenterPosition()
                this.container.setPosition(x, y)
            },
            false
        )
    }

    create() {
        const paddingButton =  Config.scenes.gameOver.button.padding
        const scaleButton = Config.scenes.gameOver.button.scale
        this.buttonPlay = this.add.buttonContainer(
            0,
            120,
            Config.packer.name,
            Config.packer.menuButton,
            0xdddddd
        )
        this.buttonPlay
            .setScale(scaleButton)
            .setText('Play Again')
            .setTextStyle(Config.scenes.gameOver.styles.button)

        this.buttonBack = this.add.buttonContainer(
            this.buttonPlay.button.width * scaleButton + paddingButton,
            120,
            Config.packer.name,
            Config.packer.menuButton,
            0xdddddd
        )
        this.buttonBack
            .setScale(scaleButton)
            .setText('Back To Menu')
            .setTextStyle(Config.scenes.gameOver.styles.button)

        this.text = this.add.text(
            (this.buttonPlay.button.width * scaleButton + paddingButton / 2) / 2,
            0,
            '',
            Config.scenes.gameOver.styles.text
        )
        this.text.setOrigin(0.5, 0.5)
        const [x, y] = this.getContainerCenterPosition()
        this.container = this.add.container(x, y, [this.text, this.buttonPlay, this.buttonBack])
    }

    getContainerCenterPosition(): [number, number] {
        const buttonWidth = this.buttonPlay.button.width * Config.scenes.gameOver.button.scale
        const buttonHeight = this.buttonPlay.button.height * Config.scenes.gameOver.button.scale
        const x = this.scale.width * 0.5 - buttonWidth * 0.5
        const y = this.scale.height * 0.5 - buttonHeight * 0.5
        return [x, y]
    }

    showMenu() {
        const stateToText = {
            lost: 'You Lose!',
            win: 'You Win!',
            play: '_',
        }
        this.text.setText(stateToText[this.gameScene.data.gameState])
    }
}
