import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene, TutorialScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'
import { TutorialStartEndScene } from './scenes/games/tutorialStartEndScene'

export function initGame(): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        title: 'spherebreak',
        scale: {
            // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
            // mode: Phaser.Scale.CENTER_BOTH,
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
    window.addEventListener('resize', () => {
        game.scale.resize(window.innerWidth, window.innerHeight)
    })
    return game
}
