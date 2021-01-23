import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'

export function initGame(): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        title: 'spherebreak',
        scale: {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
            parent: 'spherebreak',
        },
        parent: 'spherebreak',
        dom: {
            createContainer: true,
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
        scene: [BootScene, MenuScene, GameScene, GameOverScene, PauseScene, EntriesSelectionScene],
    }
    const game = new Phaser.Game(config)
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight)
    })
    return game
}
