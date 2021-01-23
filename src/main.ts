import * as Phaser from 'phaser'
import { ButtonContainer } from '~/ui/buttonContainer'
import { CoinGraphics } from './entities/Coin'
import { initGame } from '~/game'
import { initGameDistribution, mockGameDistribution } from '~/gameDistribution'
import { Config } from './config'

Phaser.GameObjects.GameObjectFactory.register(
    'buttonContainer',
    function (x: number, y: number, texture: string, frame: string, tint: number = 0xffffff) {
        return this.displayList.add(new ButtonContainer(this.scene, x, y, texture, frame, tint))
    }
)

Phaser.GameObjects.GameObjectFactory.register(
    'coin',
    function (
        x: number,
        y: number,
        width: number,
        height: number,
        texture: string,
        frame: string,
        numero: string
    ) {
        return this.displayList.add(new CoinGraphics(this.scene, x, y, width, height, texture, frame, numero))
    }
)

window.game = initGame()
if (Config.debug) {
    mockGameDistribution()
} else {
    initGameDistribution()
}
