import { createMachine, interpret } from 'xstate'
import { DifficultyGraphics, EntryGrahpics, EntryGraphicsHelper } from './graphics'
import { MenuScene } from '~/scenes/menuScene'

export interface MenuContext {
    scene: MenuScene
}

export const STATE = {
    BASE: 'base',
    ENTRIES_SELECTED: 'entriesSelected',
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
type EVENT_SELECT_ENTRIES = { type: typeof EVENT.SELECT_ENTRIES; value: {entry: EntryGrahpics, index: number} }
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
          value: typeof STATE.ENTRIES_SELECTED
          context: MenuContext
      }


export const ACTIONS = {
    PLAY: 'play',
    TUTORIAL: 'tutorial',
    CHANGE_DIFFICULTY: 'changeDifficulty',
    SELECT_ENTRIES: 'selectEntries',
    SELECT_ENTRY: 'selectEntry' ,
}


const menuMachine = createMachine<MenuContext, MenuEvent, MenuState>(
    {
        id: 'menu',
        initial: STATE.BASE,
        states: {
            [STATE.BASE]: {
                on: {
                    [EVENT.PLAY]: {
                        actions: [ACTIONS.PLAY],
                        internal: true,
                        target: STATE.BASE,
                    },
                    [EVENT.TUTORIAL]: {
                        actions: [ACTIONS.TUTORIAL],
                        internal: true,
                        target: STATE.BASE,
                    },
                    [EVENT.SELECT_ENTRIES]: {
                        target: STATE.ENTRIES_SELECTED,
                    },
                    [EVENT.SELECT_DIFFICULTY]: {
                        target: STATE.BASE,
                        internal: true,
                        actions: [ACTIONS.CHANGE_DIFFICULTY]
                    },
                },
            },
            [STATE.ENTRIES_SELECTED]: {
                entry: [ACTIONS.SELECT_ENTRIES],
                on: {
                    [EVENT.SELECT_ENTRIES]: {
                        target: STATE.ENTRIES_SELECTED,
                        internal: false
                    },
                    [EVENT.UNSELECT_ENTRIES]: {
                        target: STATE.BASE,
                    },
                    [EVENT.SELECT_ENTRY]: {
                        actions: [ACTIONS.SELECT_ENTRY],
                        target: STATE.BASE,
                    },
                },
            },
        },
    },
    {
        actions: {
            [ACTIONS.PLAY]: (context, event) => {
                context.scene.handlePlay()
            },
            [ACTIONS.TUTORIAL]: (context, event) => {
                context.scene.handleTutorial()
            },
            [ACTIONS.CHANGE_DIFFICULTY]: (context, event: EVENT_SELECT_DIFFICULTY) => {
                context.scene.handleDifficultySelected(event.value)
            },
            [ACTIONS.SELECT_ENTRIES]: (context, event: EVENT_SELECT_ENTRIES) => {
                context.scene.handleEntriesSelected(event.value.entry, event.value.index)
            },
            [ACTIONS.SELECT_ENTRY]: (context, event: EVENT_SELECT_ENTRY) => {
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
