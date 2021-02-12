import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene, TutorialScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'
import { TutorialStartEndScene } from './scenes/games/tutorialStartEndScene'
import { Config } from './config'
import { Howl, Howler } from 'howler'

export class MyGame extends Phaser.Game {
    public sounds: Record<keyof typeof Config.sounds, Howl>
    public isMute: boolean
    constructor() {
        super({
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
            audio: {
                disableWebAudio: true,
                noAudio: true,
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
        })
    }

    registerSounds(): void {
        this.sounds = {
            click: new Howl({ src: [Config.sounds.click] }),
            switch: new Howl({ src: [Config.sounds.switch] }),
            pling1: new Howl({ src: [Config.sounds.pling1] }),
            pling2: new Howl({ src: [Config.sounds.pling2] }),
            pling3: new Howl({ src: [Config.sounds.pling3] }),
            pling4: new Howl({ src: [Config.sounds.pling4] }),
            pling5: new Howl({ src: [Config.sounds.pling5] }),
            pling6: new Howl({ src: [Config.sounds.pling6] }),
            pling7: new Howl({ src: [Config.sounds.pling7] }),
            pling8: new Howl({ src: [Config.sounds.pling8] }),
            pling9: new Howl({ src: [Config.sounds.pling9] }),
            engine: new Howl({ src: [Config.sounds.engine] }),
            gameover: new Howl({ src: [Config.sounds.gameover] }),
        }
    }

    start(): void {
        this.registerSounds()
        this.isMute = Config.mute
        Howler.autoUnlock = false;
        if(this.isMute) {
            Howler.mute(this.isMute)
        }
        super.start()
    }
}
