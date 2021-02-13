import { BootScene } from '~/scenes/bootScene'
import { GameScene, PauseScene, TutorialScene } from '~/scenes/games'
import { MenuScene } from '~/scenes/menus'
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader'
import { EntriesSelectionScene } from '~/scenes/menus/entriesSelectionScene'
import { GameOverScene } from './scenes/games/gameOverScene'
import { TutorialStartEndScene } from './scenes/games/tutorialStartEndScene'
import { Config } from './config'
import { Howl, Howler } from 'howler'
import { Capacitor, Plugins } from "@capacitor/core"
const { NativeAudio } = Plugins
console.log(Capacitor)


export class MyGame extends Phaser.Game {
    public sounds: Record<keyof typeof Config.sounds, Howl>
    public isMute: boolean
    constructor() {
        super({
            type: Phaser.CANVAS,
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
        if(Capacitor.isNative) {
            console.log('load assets')
            NativeAudio.preloadSimple({ assetId: 'click', assetPath: 'click1.ogg'}).then(() => {
                console.log('hello')
            })
            NativeAudio.preloadSimple({ assetId: 'click1', assetPath: 'click1'})
            NativeAudio.preloadSimple({ assetId: 'switch', assetPath: 'sounds/switch1.webm'})
            NativeAudio.preloadSimple({ assetId: 'ping2', assetPath: Config.sounds.pling2})
            NativeAudio.preloadSimple({ assetId: 'ping3', assetPath: Config.sounds.pling3})
            NativeAudio.preloadSimple({ assetId: 'ping4', assetPath: Config.sounds.pling4})
            NativeAudio.preloadSimple({ assetId: 'ping5', assetPath: Config.sounds.pling5})
            NativeAudio.preloadSimple({ assetId: 'ping6', assetPath: Config.sounds.pling6})
            NativeAudio.preloadSimple({ assetId: 'ping7', assetPath: Config.sounds.pling7})
            NativeAudio.preloadSimple({ assetId: 'ping8', assetPath: Config.sounds.pling8})
            NativeAudio.preloadSimple({ assetId: 'ping9', assetPath: Config.sounds.pling9})
            NativeAudio.preloadSimple({ assetId: 'engine', assetPath: Config.sounds.engine})
            NativeAudio.preloadSimple({ assetId: 'gameover', assetPath: Config.sounds.gameover})
            
        } else {
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
    }

    playSound(key: keyof typeof Config.sounds) {
        if(Capacitor.isNative) {
            NativeAudio.play({assetId: key })
        } else {
            this.sounds[key].play()
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
