const isDebug = process.env.DEBUG
import * as Phaser from 'phaser'
import { ButtonContainer } from '~/ui/buttonContainer'
import { CoinGraphics } from './entities/Coin'
import { initGame } from '~/game'
import { initGameDistribution, mockGameDistribution } from '~/gameDistribution'

Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    x: number,
    y: number,
    key: string,
    tint: number = 0xffffff
) {
    return this.displayList.add(new ButtonContainer(this.scene, x, y, key, tint))
})

Phaser.GameObjects.GameObjectFactory.register('coin', function (
    x: number,
    y: number,
    width: number,
    height: number,
    frame: string,
    numero: string
) {
    return this.displayList.add(new CoinGraphics(this.scene, x, y, width, height, frame, numero))
})

window.game = initGame()
if (isDebug) {
    mockGameDistribution()
} else {
    initGameDistribution()
}
