import { BootScene } from '~/scenes/bootScene'
import { GameScene } from '~/scenes/gameScene'
import { MenuScene } from '~/scenes/menuScene'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'

export function initGame(): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        title: 'spherebreak',
        scale: {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            autoCenter: Phaser.Scale.NONE,
            parent: 'nebulaleague',
        },
        plugins: {
            global: [
                {
                    key: 'WebFontLoader',
                    plugin: WebFontLoaderPlugin,
                    start: true,
                },
            ],
        },
        scene: [BootScene, MenuScene, GameScene],
    }
    return new Phaser.Game(config)
}
