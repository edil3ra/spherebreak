import * as _ from 'phaser'
//@ts-ignore
import * as Phaser from './lib/phaser-facebook-instant-games.js'

import { BootScene } from '~/scenes/bootScene'
import { GameScene } from '~/scenes/gameScene'
import { MenuScene } from '~/scenes/menuScene'
import { ButtonContainer } from '~/ui/buttonContainer'


Phaser.GameObjects.GameObjectFactory.register('buttonContainer', function (
    x: number,
    y: number,
    key: string,
    tint: number = 0xffffff
) {
    return this.displayList.add(new ButtonContainer(this.scene, x, y, key, tint))
})


//@ts-ignore
FBInstant.initializeAsync().then(() => {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        title:'spherebreak',
        scale: {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            autoCenter: Phaser.Scale.NONE,
            parent: 'nebulaleague',
        },
        scene: [BootScene, MenuScene, GameScene],
    }
    const game = new Phaser.Game(config)
    game.scene.start('boot')
})
