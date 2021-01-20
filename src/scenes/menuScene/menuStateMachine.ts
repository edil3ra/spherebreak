import { createMachine, interpret } from 'xstate'
import { DifficultyGraphics } from './graphics'
import { MenuScene } from './menuScene'

export interface MenuContext {
    scene: MenuScene
}

export const STATE = {
    BASE: 'base',
    PLAY: 'play',
    TUTORIAL: 'tutorial',
    DIFFICULTY: 'difficulty',
    ENTRIY_SELECTED: 'entrySelected',
}

export const EVENT = {
    PLAY: 'PLAY',
    TUTORIAL: 'TUTORIAL',
    SELECT_ENTRY: 'SELECT_ENTRY',
    UNSELECT_ENTRY: 'UNSELECT_ENTRY',
    SELECT_DIFFICULTY: 'SELECT_DIFFICULTY',
}

type EVENT_PLAY = { type: typeof EVENT.PLAY }
type EVENT_TUTORIAL = { type: typeof EVENT.TUTORIAL }
type EVENT_SELECT_ENTRY = { type: typeof EVENT.SELECT_ENTRY }
type EVENT_UNSELECT_ENTRY = { type: typeof EVENT.UNSELECT_ENTRY }
type EVENT_SELECT_DIFFICULTY = { type: typeof EVENT.SELECT_DIFFICULTY; value: DifficultyGraphics }

export type MenuEvent =
    | EVENT_PLAY
    | EVENT_TUTORIAL
    | EVENT_SELECT_ENTRY
    | EVENT_UNSELECT_ENTRY
    | EVENT_SELECT_DIFFICULTY

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
          value: typeof STATE.ENTRIY_SELECTED
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
                    [EVENT.SELECT_ENTRY]: {
                        target: STATE.ENTRIY_SELECTED,
                    },
                    [EVENT.SELECT_DIFFICULTY]: {
                        target: STATE.DIFFICULTY,
                    },
                },
            },
            [STATE.ENTRIY_SELECTED]: {
                on: {
                    ENTRIES_UNSELECTED: {
                        target: STATE.BASE,
                    },
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
