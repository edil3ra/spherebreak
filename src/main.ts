import * as Phaser from 'phaser'
import { ButtonContainer } from './ui/buttonContainer'
import { CoinGraphics } from './entities/Coin'
import { MyGame } from './game'
import { initGameDistribution, mockGameDistribution } from './gameDistribution'
import { Config } from './config'
import { CoinType } from './models'

Phaser.GameObjects.GameObjectFactory.register(
    'buttonContainer',
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        x: number,
        y: number,
        texture: string,
        frame: string,
        tint: number = 0xffffff
    ) {
        return this.displayList.add(new ButtonContainer(this.scene, x, y, texture, frame, tint))
    }
)

Phaser.GameObjects.GameObjectFactory.register(
    'coin',
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        x: number,
        y: number,
        width: number,
        height: number,
        type: CoinType,
        texture: string,
        frame: string,
        numero: string
    ) {
        return this.displayList.add(
            new CoinGraphics(this.scene, x, y, width, height, type, texture, frame, numero)
        )
    }
)

window.game = new MyGame()
if (Config.debug) {
    mockGameDistribution()
} else {
    initGameDistribution()
}
