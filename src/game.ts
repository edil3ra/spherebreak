import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene, TutorialScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'
import { TutorialStartEndScene } from './scenes/games/tutorialStartEndScene'
import { Config } from './config'
import { Howl, Howler } from 'howler'
import { Capacitor, Plugins } from '@capacitor/core'
import { SoundKeys } from './models'
const { NativeAudio } = Plugins

export class MyGame extends Phaser.Game {
    public sounds: Record<SoundKeys, Howl>
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
        if (Capacitor.isNative) {
            NativeAudio.preloadSimple({
                assetId: Config.sounds.click.name,
                assetPath: Config.sounds.click.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.switch.name,
                assetPath: Config.sounds.switch.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling1.name,
                assetPath: Config.sounds.pling2.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling2.name,
                assetPath: Config.sounds.pling3.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling3.name,
                assetPath: Config.sounds.pling4.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling4.name,
                assetPath: Config.sounds.pling5.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling5.name,
                assetPath: Config.sounds.pling6.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling6.name,
                assetPath: Config.sounds.pling7.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling7.name,
                assetPath: Config.sounds.pling8.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.pling8.name,
                assetPath: Config.sounds.pling9.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.engine.name,
                assetPath: Config.sounds.engine.androidPath,
            })
            NativeAudio.preloadSimple({
                assetId: Config.sounds.gameover.name,
                assetPath: Config.sounds.gameover.androidPath,
            })
        } else {
            this.sounds = {
                [Config.sounds.click.name]: new Howl({ src: Config.sounds.click.webPath }),
                [Config.sounds.switch.name]: new Howl({ src: Config.sounds.switch.webPath }),
                [Config.sounds.pling1.name]: new Howl({ src: Config.sounds.pling1.webPath }),
                [Config.sounds.pling2.name]: new Howl({ src: Config.sounds.pling2.webPath }),
                [Config.sounds.pling3.name]: new Howl({ src: Config.sounds.pling3.webPath }),
                [Config.sounds.pling4.name]: new Howl({ src: Config.sounds.pling4.webPath }),
                [Config.sounds.pling5.name]: new Howl({ src: Config.sounds.pling5.webPath }),
                [Config.sounds.pling6.name]: new Howl({ src: Config.sounds.pling6.webPath }),
                [Config.sounds.pling7.name]: new Howl({ src: Config.sounds.pling7.webPath }),
                [Config.sounds.pling8.name]: new Howl({ src: Config.sounds.pling8.webPath }),
                [Config.sounds.pling9.name]: new Howl({ src: Config.sounds.pling9.webPath }),
                [Config.sounds.engine.name]: new Howl({ src: Config.sounds.engine.webPath }),
                [Config.sounds.gameover.name]: new Howl({ src: Config.sounds.gameover.webPath }),
            } as Record<SoundKeys, Howl>
        }
    }

    playSound(key: SoundKeys) {
        if (this.isMute) {
            return null
        }
        
        if (Capacitor.isNative) {
            NativeAudio.play({ assetId: key })
        } else {
            this.sounds[key].play()
        }
    }

    start(): void {
        this.registerSounds()
        this.isMute = Config.mute
        Howler.autoUnlock = false
        super.start()
    }
}
