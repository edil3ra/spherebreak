const isDebug = process.env.DEBUG
import * as Phaser from 'phaser'
import { ButtonContainer } from '~/ui/buttonContainer'
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


// window.game = initGame()
window.game = initGame()
if (isDebug ) {
    mockGameDistribution()
} else {
    initGameDistribution()
}
