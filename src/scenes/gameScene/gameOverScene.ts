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
        this.buttonPlay = this.add.buttonContainer(
            0,
            100,
            Config.packer.name,
            Config.packer.menuButton,
            0xdddddd
        )
        this.buttonPlay.setText('Play Again').setTextStyle(Config.scenes.gameOver.styles.button)

        this.buttonPlay.button.setDisplaySize(
            Config.scenes.gameOver.button.width,
            Config.scenes.gameOver.button.height
        )

        this.buttonPlay.button.setSize(
            Config.scenes.gameOver.button.width,
            Config.scenes.gameOver.button.height
        )

        this.buttonBack = this.add.buttonContainer(
            this.buttonPlay.button.width + Config.scenes.gameOver.button.padding,
            100,
            Config.packer.name,
            Config.packer.menuButton,
            0xdddddd
        )
        this.buttonBack.setText('Back To Menu').setTextStyle(Config.scenes.gameOver.styles.button)
        
        this.buttonPlay.button.setSize(
            Config.scenes.gameOver.button.width,
            Config.scenes.gameOver.button.height
        )
        this.buttonBack.button.setDisplaySize(
            Config.scenes.gameOver.button.width,
            Config.scenes.gameOver.button.height
        )

        this.text = this.add.text(
            (this.buttonPlay.button.width + Config.scenes.gameOver.button.padding / 2) / 2,
            0,
            '',
            Config.scenes.gameOver.styles.text
        )
        this.text.setOrigin(0.5, 0.5)
        const [x, y] = this.getContainerCenterPosition()
        this.container = this.add.container(x, y, [this.text, this.buttonPlay, this.buttonBack])
    }

    getContainerCenterPosition(): [number, number] {
        const buttonWidth = this.buttonPlay.button.width
        const buttonHeight = this.buttonPlay.button.height
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
