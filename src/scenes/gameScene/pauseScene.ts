import { Config } from '~/config'
import { GameScene } from '~/scenes/gameScene'

export class PauseScene extends Phaser.Scene {
    public images: Array<Phaser.GameObjects.Image>
    public id: number
    constructor() {
        super({ key: Config.scenes.keys.gamePause })
    }

    init() {
        this.images = []
        this.id = 0
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => {
            this.scene.resume(Config.scenes.keys.game)
            this.scene.sleep(Config.scenes.keys.gamePause)
        })


        this.input.mouse.disableContextMenu();
        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            if(pointer.rightButtonDown()) {
                for (let image of this.images) {
                    image.destroy()
                }
                this.images = []
            }

            if(pointer.leftButtonDown()) {
                this.images.push(this.add.image(
                    this.game.input.mousePointer.x,
                    this.game.input.mousePointer.y,
                    Config.packer.name,
                    Config.packer.hand
                ))
            }

        })

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I).on('down', () => {
            const scene = this.scene.get(Config.scenes.keys.game) as GameScene

            // this.add.image(this.game.input.mousePointer.x, this.game.input.mousePointer.y)

            this.game.renderer.snapshotArea(
                scene.boardPanel.container.x,
                scene.boardPanel.container.y,
                424,
                544,
                (image: HTMLImageElement) => {
                    localStorage.setItem(`snapshot-${this.id}`, image.src)
                },
                'png'
            )
            this.id ++
        })
    }
}
