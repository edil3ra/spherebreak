import { Config } from "~/config";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({key: Config.scenes.keys.gamePause})
    }

    init() {
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on(('down'), () => {
            this.scene.resume(Config.scenes.keys.game)
            this.scene.sleep(Config.scenes.keys.gamePause)
        })
    }
}
