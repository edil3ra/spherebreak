import { createMachine, interpret } from 'xstate'
import { DifficultyGraphics, EntryGrahpics, EntryGraphicsHelper } from './graphics'
import { MenuScene } from './menuScene'

export interface MenuContext {
    scene: MenuScene
}

export const STATE = {
    BASE: 'base',
    PLAY: 'play',
    TUTORIAL: 'tutorial',
    DIFFICULTY: 'difficulty',
    ENTRIES_SELECTED: 'entriesSelected',
    ENTRY_SELECTED: 'entrySelected',
}

export const EVENT = {
    PLAY: 'PLAY',
    TUTORIAL: 'TUTORIAL',
    SELECT_DIFFICULTY: 'SELECT_DIFFICULTY',
    SELECT_ENTRIES: 'SELECT_ENTRIES',
    UNSELECT_ENTRIES: 'UNSELECT_ENTRIES',
    SELECT_ENTRY: 'SELECT_ENTRY',
}

type EVENT_PLAY = { type: typeof EVENT.PLAY }
type EVENT_TUTORIAL = { type: typeof EVENT.TUTORIAL }
type EVENT_SELECT_DIFFICULTY = { type: typeof EVENT.SELECT_DIFFICULTY; value: DifficultyGraphics }
type EVENT_SELECT_ENTRIES = { type: typeof EVENT.SELECT_ENTRIES; value: EntryGrahpics }
type EVENT_UNSELECT_ENTRIES = { type: typeof EVENT.UNSELECT_ENTRIES }
type EVENT_SELECT_ENTRY = { type: typeof EVENT.SELECT_ENTRY, value: EntryGraphicsHelper }

export type MenuEvent =
    | EVENT_PLAY
    | EVENT_TUTORIAL
    | EVENT_SELECT_DIFFICULTY
    | EVENT_SELECT_ENTRIES
    | EVENT_UNSELECT_ENTRIES
    | EVENT_SELECT_ENTRY

export type MenuState =
    | {
          value: typeof STATE.BASE
          context: MenuContext
      }
    | {
          value: typeof STATE.PLAY
          context: MenuContext
      }
    | {
          value: typeof STATE.TUTORIAL
          context: MenuContext
      }
    | {
          value: typeof STATE.DIFFICULTY
          context: MenuContext
      }
    | {
          value: typeof STATE.ENTRIES_SELECTED
          context: MenuContext
      }
    | {
          value: typeof STATE.ENTRY_SELECTED
          context: MenuContext
      }



const menuMachine = createMachine<MenuContext, MenuEvent, MenuState>(
    {
        id: 'menu',
        initial: STATE.BASE,
        states: {
            [STATE.BASE]: {
                on: {
                    [EVENT.PLAY]: {
                        target: STATE.PLAY,
                    },
                    [EVENT.TUTORIAL]: {
                        target: STATE.TUTORIAL,
                    },
                    [EVENT.SELECT_ENTRIES]: {
                        target: STATE.ENTRIES_SELECTED,
                    },
                    [EVENT.SELECT_DIFFICULTY]: {
                        target: STATE.DIFFICULTY,
                    },
                },
            },
            [STATE.ENTRIES_SELECTED]: {
                entry: ['entriesSelected'],
                on: {
                    [EVENT.SELECT_ENTRIES]: {
                        target: STATE.ENTRIES_SELECTED,
                        internal: false
                    },
                    [EVENT.UNSELECT_ENTRIES]: {
                        target: STATE.BASE,
                    },
                    [EVENT.SELECT_ENTRY]: {
                        target: STATE.ENTRY_SELECTED,
                    },
                },
            },
            [STATE.ENTRY_SELECTED]: {
                entry: ['entrySelected'],
                on: {
                    '': STATE.BASE,
                },
            },
            [STATE.PLAY]: {
                type: 'final',
                entry: ['play'],
            },
            [STATE.TUTORIAL]: {
                type: 'final',
                entry: ['tutorial'],
            },
            [STATE.DIFFICULTY]: {
                entry: ['difficulty'],
                on: {
                    '': STATE.BASE,
                },
            },
        },
    },
    {
        actions: {
            play: (context, event) => {
                context.scene.handlePlay()
            },
            tutorial: (context, event) => {
                context.scene.handleTutorial()
            },
            difficulty: (context, event: EVENT_SELECT_DIFFICULTY) => {
                context.scene.handleDifficultySelected(event.value)
            },
            entriesSelected: (context, event: EVENT_SELECT_ENTRIES) => {
                context.scene.handleEntriesSelected(event.value)
            },
            entrySelected: (context, event: EVENT_SELECT_ENTRY) => {
                console.log('hello')
                context.scene.handleEntrySelected(event.value)
            },
        },
    }
)

export function buildMenuService(scene: MenuScene) {
    const menuService = interpret(
        menuMachine.withContext({
            scene: scene,
        })
    )
    return menuService
}

// menuService.subscribe((state) => {
//     console.log('hello')
// })
