# Extending the CattoDog example

Here is the initial example:

## The initial example

```js
// init API
import { createAPI } from 'obs-disp'
const { obsDispCreator, dispatchEvent, removeObs } = createAPI()
////////////

const createCattoDog = obsDispCreator(() => {
  const somePrivateVar = {}

  return {
    'OBS_CREATE': () => { /* if init logic needed, called just after createCattoDog() */}
    'MEOW': () => console.log('meow'),
    'BARK': () => console.log('BARK BARK'),
    'OBS_REMOVE': () => { /* do cleanup if needed */}
  }
})

const cattoDog = createCattoDog()
const cattoDog2 = createCattoDog()
dispatchEvent('BARK') // all catto-dogs will BARK
dispatchEvent('MEOW') // all catto-dogs will MEOW

// you don't need those anymore?
removeObs(cattoDog)
removeObs(cattoDog2)

dispatchEvent('MEOW') // nothing happens - no catto-dogs
```

This example only creates 2 ODs, dispatches 2 events and removes the ODs.
What if we wanted to do sth more interesting then?

Let's think about the following: we want to count the number of `meow`s or `bark`s.
When a catto-dog object does `meow` more than 3 times, it's going to _turn into_ a Cat (we will use a `createCat` obs creator for this).

NB: while we can bake the logic for becoming a Cat inside of the CattoDog, we will do sth much more interesting -
we will destroy/remove the current CattoDog (from inside of it) and create the new observer, again from inside of it.

## Extending the example to turn into a Cat if too many meows

```ts
import { createAPI, IObserver } from 'obs-disp'
const { obsDispCreator, dispatchEvent, removeObs } = createAPI()

const createCattoDog = obsDispCreator(() => {
  const state = {
    obs: null as IObserver,
    meowCount: 0,
    barkCount: 0,
  }

  return {
    OBS_CREATE: ({ payload }) => {
      // the OBS_CREATE event has special payload - the observer that is created,
      // let's store that
      state.obs = payload.obs.instance as IObserver
    },
    // CT stands for CattoDog
    CT_MEOW: () => {
      console.log('CT meows')
      state.meowCount++

      if (state.meowCount > 3) {
        console.log('WOW... you are becoming more of a cat!')
        removeObs(state.obs)

        // pass the mewoCount via tha `observer params`
        createCat({ meowCount })
      }
    },
    CT_BARK: () => {
      console.log('BARK BARK')
      state.barkCount++
    },
    OBS_REMOVE: () => {
      dispatchEvent('CT_REMOVED')
      /* do cleanup if needed */
    },
  }
})

// if using TypeScript - you can define the params the returned function will expect
const createCat = obsDispCreator<{ meowCount: number }>(({ meowCount }) => {
  const state = {
    meowCount,
  }

  return {
    OBS_CREATE: ({ payload }) => {
      console.log('Cat obs created!')
      dispatchEvent('CAT_CREATED')
    },
    CT_MEOW: () => {
      console.log('This is now a Cat - not a CattoDog!')
    },
    CAT_MEOW: () => {
      console.log('Cat meows')
      state.meowCount++
    },
    OBS_REMOVE: () => {
      dispatchEvent('CAT_REMOVED')
      /* do cleanup if needed */
    },
  }
})

const createAnimalStats = obsDispCreator(() => {
  const state = {
    cattoDogCount: 0,
    catCount: 0,
  }

  const onStatsUpdate = () => {
    dispatchEvent('ANIMAL_STATS_UPDATED', { payload: { ...state } })
  }

  return {
    CT_CREATED: () => {
      state.cattoDogCount++
      onStatsUpdate()
    },
    CT_REMOVED: () => {
      state.cattoDogCount--
      onStatsUpdate()
    },
    CAT_CREATED: () => {
      state.catCount++
      onStatsUpdate()
    },
    CAT_REMOVED: () => {
      state.catCount--
      onStatsUpdate()
    },

    ANIMAL_STATS_UPDATED: ({ payload }) => {
      console.log('Animal stats: ', payload)
    },
  }
})

const cattoDog = createCattoDog() // Animal stats: ...
dispatchEvent('CT_MEOW') // CT meows
dispatchEvent('CT_MEOW') // CT meows
dispatchEvent('CT_MEOW') // CT meows
dispatchEvent('BARK') // CT barks

dispatchEvent('CT_MEOW') // CT meows   ;   WOW... you are becoming more of a cat!  ;   // Animal stats: ...  ;  // Animal stats: ...

dispatchEvent('CT_MEOW') // This is now a Cat - not a CattoDog!

dispatchEvent('CAT_MEOW') // Cat meows
```

## The extended example demonstrated

- dynamic creation and removal of different ODs, and tracking it via a 3rd observer
- getting the instance of the current OD
- passing create params to an OD
- dispatching events with params (pass `payload`) - `ANIMAL_STATS_UPDATED`
- creating a singleton observer (`createAnimalStats`), pass id to make it singleton
  - trying to create more instances of it fails
- note: `OBS_CREATE` and `OBS_REMOVE` are internally dispatched to only the respective observers
