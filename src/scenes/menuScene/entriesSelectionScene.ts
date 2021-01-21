import { buildMenuService, MenuContext, EVENT as EVENT_MENU } from '~/scenes/menuScene/menuStateMachine'
import { Config } from '~/config'
import { MenuScene } from '~/scenes/menuScene'
import { EntryGrahpics, EntryGraphicsHelper } from './graphics'

export class EntriesSelectionScene extends Phaser.Scene {
    menuScene: MenuScene
    entriesHelperGraphics: Array<EntryGraphicsHelper>
    entriesHelpContainer: Phaser.GameObjects.Container

    constructor() {
        super({ key: Config.scenes.keys.entriesSelection })
    }

    init(menuScene: MenuScene) {
        window.addEventListener(
            'resize',
            () => {
                this.entriesHelpContainer.setPosition(this.scale.width / 2, this.scale.height / 2)
            },
            false
        )
        this.menuScene = menuScene

        this.events.on('wake', () => {
            this.showEntries()
        })
    }

    create() {
        this.setEntriesContainer()
        this.input.on(
            'pointerdown',
            () => {
                this.menuScene.stateService.send(EVENT_MENU.UNSELECT_ENTRIES)
                this.menuScene.fromEntriesToSelectionToMenu()
            },
            this
        )
    }

    setEntriesContainer() {
        this.entriesHelperGraphics = []
        for (const index of Array(9).keys()) {
            const x = index % 3
            const y = Math.floor(index / 3)
            const entryHelper = new EntryGraphicsHelper(
                this,
                (x - 1) *
                    (Config.scenes.menu.helperEntries.width + Config.scenes.menu.helperEntries.xPadding),
                (y - 1) *
                    (Config.scenes.menu.helperEntries.height + Config.scenes.menu.helperEntries.yPadding),
                Config.scenes.menu.helperEntries.width,
                Config.scenes.menu.helperEntries.height,
                Config.packer.name,
                Config.packer.coinBorder,
                index + 1
            )
            entryHelper.image
                .setInteractive({ cursor: 'pointer', pixelPerfect: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                    this.menuScene.stateService.send(EVENT_MENU.SELECT_ENTRY, { value: entryHelper })
                })
            entryHelper.image.setInteractive({ enabled: false })
            this.entriesHelperGraphics.push(entryHelper)
        }
        this.entriesHelpContainer = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2,
            this.entriesHelperGraphics
        )
    }

    showEntries() {
        const numbersToExclude = this.menuScene.entriesGraphics.map((graphic) => {
            return graphic.numero
        })
        
        this.entriesHelperGraphics.forEach((entry: EntryGraphicsHelper) => {
            if (numbersToExclude.find((exclude) => exclude === entry.numero)) {
                entry.image.setAlpha(0.4).setActive(false)
            } else {
                entry.image.setAlpha(1).setActive(true)
            }
        })
    }
}
