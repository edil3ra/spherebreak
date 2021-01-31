import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene, TutorialScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'
import { TutorialStartEndScene } from './scenes/games/tutorialStartEndScene'
import { Config } from './config'

export function initGame(): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        title: 'spherebreak',
        scale: {
            width: window.innerWidth,
            height: window.innerHeight,
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
        scene: [
            BootScene,
            MenuScene,
            GameScene,
            GameOverScene,
            PauseScene,
            EntriesSelectionScene,
            TutorialScene,
            TutorialStartEndScene,
        ],
    }
    const game = new Phaser.Game(config)
    game.sound.mute = Config.mute
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight)
    })
    return game
}
