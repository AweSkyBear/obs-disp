# Obs Disp Conventions and Design Principles

## Why?

Conventions help us *not* think about unimportant details and let us focus on what matters -
what your software should do.

## Contents

- [Obs Disp Conventions and Design Principles](#obs-disp-conventions-and-design-principles)
  - [Why?](#why)
  - [Contents](#contents)
  - [Conventions](#conventions)
    - [General](#general)
      - [OD creator functions start with create\*](#od-creator-functions-start-with-create)
      - [Single file for every OD](#single-file-for-every-od)
      - [Use a single `state` variable](#use-a-single-state-variable)
      - [Manage state via "private" functions](#manage-state-via-private-functions)
  - [Design Principles](#design-principles)

## Conventions

### General

#### OD creator functions start with create*

Examples (domain: games):

- `createGameLoop` - dispatches `GAME_UPDATE` continuosly
- `createInputTracker` - tracks keyboard/gamepad input and dispatches events
- `createPlayer` - draws player, tracks input events and handles player interactions with other objects
- `createGame` - a general observer which creates instances of all game-related observers (like )

Examples (domain: html5 apps):

- `createInput` - creates an input element, manages lifecycle, tracks and dispatches events for its instance
- `createTextarea` - creates an textarea element... rest is similar to the above
- `createButton` - ... you got the idea

Examples (domain: any arbitrary app in the browser):

- `createResizeTracker` - attaches `resize` handler on the document, dispatches `DOCUMENT_RESIZE`
- `createHTMLEvents` - tracks all events on the document and dispatches either a generic event (example: `HTML_EV_ANY`) with `payload` the event name and arguments, or/and also dispatches events which other components can listen to (e.g. `HTML_EV_CLICK`, `HTML_EV_DRAG_START`, `HTML_EV_INPUT`, etc.))
- `createCalculateLandArea` - service-like - accepts an event to request some work done (e.g. `LAND_AREA_REQUEST_CALCULATE`) and dispatches back an event when the work is done: `LAND_AREA_CALCULATED` with the respective result payload
- `createCanvasDrawing` - contextual controller - listens for events and draws to a `canvas` element for a drawing app, for example: `BRUSH_STROKE` (with payload of the position and the ), `PAINT_FILL` (with payload the position and any other parameters regarding the fill), `COLOR_SET_MAIN` - updates the internal `state` to have the main color used in other events. `COLOR_SET_SECONDARY` - updates the internal `state` so that tools use that as a secondary color

#### Single file for every OD

Examples:

Filename: `<root>/common/createInput.ts`
```ts
// common/createInput.ts
...
export const createInput = obsDispCreator(...)
```

---

Filename: `<root>/game/createPlayer.ts`
```ts
// common/createPlayer.ts
...
export const createPlayer = obsDispCreator(...)
```

#### Use a single `state` variable

When creating obs-disp creators (using `obsDispCreator` or when directly adding one with `addObsDisp`) store anything that your OD changes to a `state` variable

Examples:

Domain: html5 apps (imagine React/Angular)

```ts
const createCounter = obsDispCreator(() => {
    const state = {
        count: 0,
        counterEl: null as HTMLElement
    }

    return {
        OBS_CREATE: () => {
            // code to initialize the counter
            state.counterEl = ...
        }
        COUNTER_INCR: () => state.count++,
        COUNTER_DECR: () => state.count--,
        OBS_REMOVE: () => {
            // code to remove the counter
            // <remove it>
            state.counterEl = null
        }
    }
})
```

---

Domain: a tic-tac-toe game

```ts
// createTicTacToe.ts
const createTicTacToeGame = obsDispCreator(() => {
    // here is our state
    const state = {
        // here is our state
        board: initBoard(),
    }

    const checkGameWon = () => { /* has access to state */ }
    const checkGameLost = () => { /* has access to state */ }

    const handleRequestPlaceMove = (args) => { /* has access to state */ }

    return {
        GAME_REQUEST_PLACE_MOVE: (ev) => {
            /* logic to set an O or X on the board, if position is not taken */
            handleRequestPlaceMove(ev.payload)
        }
        ...
    }
})

const initBoard = () => { /* return a 2d array for the board */ }

// createRenderBoard.ts
const createBoardRenderer = obsDispCreator(() => {
    // here is our state
    const state = {
        boardElements: [] as HTMLElement[]
    }

    return {
        OBS_CREATE: () => {
            // initialize the board elements that we draw
            state.boardElements = ... // code to create html elements or draw onto canvas or in console

            // attach click handlers to dispatch GAME_REQUEST_PLACE_MOVE
        },
        GAME_WON: () => { ... /* code to handle what happens when the board */},
        GAME_LOST: () => { ... },
        OBS_REMOVE: () => {
            // code to clean up the board, e.g.
            state.boardElements.forEach(el => el.remove())
            state.boardElements = []
        }
        ...
    }
})

// index.ts
createTickTacToeGame()
createBoardRenderer()
```

#### Manage state via "private" functions

Examples: see the `checkGameWon`, `checkGameLost`, `handleRequestPlaceMove` from above.

These functions are accessible only from the OD instance and do not polute the module scope but deal with the `state` of the OD.

## Design Principles

\<work in progress\>

Note: you can find real usages on the [Usage Examples Page](https://aweskybear.github.io/obs-disp-examples/) and [Repo](https://github.com/AweSkyBear/obs-disp-examples)
