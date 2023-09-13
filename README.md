# Obs Disp

Create 0-coupling declarative event-bound components with functions and objects only. Build flexible apps for the browser.

---

- **for all the folks** who are wondering **what's a right way to write CLEAN** JavaScript.
- for **everyone who struggles** to understand **how to structure** an arbitrary app for the browser (be it small or large)
- and about **how to keep the code clean**, while retaining sanity, not bogging down into extreme amounts of painful implementation details or heavy abstractions
- **...without being a genius**

## The Problem

1. You are planning on creating a non-trivial app (you have hopes)
2. You have a lot objects and a lot of interactions between them
3. You have a lot of user input
4. You have a lot of separate pieces of logic
5. You don't know and can't predict all (or almost any) of what  you'll be building when you begin.
6. You don't want to fall into the trap of overengeering and over-abstracting
7. You want to be able to prototype rapidly
8. You want something scalable for in-browser logic
9.  You want to take back control of the flows in your application (every piece of it)
10. You want to be able to build a game... or a SPA... or create a reusable component for anything in the browser...
12. You want sane state management (the most difficult part in front-end development)
13. You don't want to be complying to anything other than pure JavaScript (no heavy or constraining libraries and frameworks)
14. You are scared of huge and ugly abstractions which go wrong or turn on implicit logic resulting in hours of debugging
15. You are scared of OOP and huge class hierarchies (you got into a mess, didn't you)
16. You are scared of *automatic* and *subtle* logic, autotriggered due to some convention somebody thought was useful
17. You are sick of cohorts of concepts to learn to do a simple input with 3 buttons and a text field (for example ;) )
18. You are wondering how are you supposed to come up with all that logic and write it cleanly in an ever-expanding app
19. You believe there must be a way...

**Then... what's** the simplest *useful* form JavaScript can take in these cases?

## The Solution

This is `obs-disp`. A combination of a few most useful software patterns for managing state, streamlined in way *not to harm* JavaScript *but gain from it in a natural way*.

Let's build real-life clean-code easily extensible apps! **Now!**

## What's obs-disp?  

<div id="dialogue"/>

### Let's start with a dialogue...
> _Somewhere in a parallel universe_

_JavaScript and a Computer talking_

<img src="repo-docs/comp-vs-js.svg"  width="500">

_Imagine the Computer has a squeaky voice_

> - **COMPUTER**: Lovely JavaScript, is that you???
> - **JAVASCRIPT**: Yes, that's me!!!
> - **C**: But JS, why you lovely?
> - **JS**: Because I am simple, I am beautiful
> - **C**: I don't understand _beautiful_, define _beautiful_..
> - **JS**: I use functions and objects - _only_
> - **C**: But hooooow?!
> - **JS**: I un-use `class`es, `new`s, popular OOP and a bulk of design patterns you may have heard of
> - **C**: But Whyyyyyy?
> - **JS**: Because I am flexible, functional, _even sexy!_
> - **C**: But ...
> - **JS**: ...I discard complexity! Because I need NO classes, directives, cohorts of patterns.....
> - **JS**: ...(I discard) a myriad of NEW concepts for the dev to get going with a simple calculator app in the browser
> - **JS**: **I only need**... a little something...
> - **C**: But whaaat?!
> - **JS**: This little something adds to my natural superpowers! I remain simple... to build anything.. sanely... - it's called **obs-disp**! It handles the communication between my objects.
> - **C**: **But hoOooOOw ??!**
> - **JS**: **Like this**: write your plain old functions in plain old me (JavaScript), make them return a single object - this object has arbitrary keys - events. The values are functions to handle these events! **Aaand** a single call can trigger them - from anywhere! No prior event definition required! Though possible, TypeScript included!
> - **C**: WOOOOW
> - **JS**: Aaand the main point is **JUST this - create functions (scope), manage this scope only downwards and... dispatch events** - the functions will now react to those events! `[eventName]: () => { ...event trggered... }`
> - **C**: Surely..
> - **JS**: .. That's ALL!
> - **C**: Surely this cannot be real!
> - **JS**: _It is real. And don't call me Surely!_
> - **JS**: **My name is Script... JavaScript**.
>
> :: { PEWWWPEWWPEWW } ERROR ERROR ERROR \<**the given universe explodes, err msg: AWESOMENESS spiked to level 9k^22**\> ERROR ERROR ERROR
>
> .

## Pure JS vs ObsDisp example

Let's have an example.

How can we create an object and trigger sth onto it? In plain JS and with obs-disp?

**Plain JS**

One way would be (don't do this):

```js
const createCattoDog = () => {
  const somePrivateVar = {}

  return {
    meow: () => console.log('meow'),
    bark: () => console.log('BARK BARK'),
  }
}

const cattoDog = createCattoDog()
const cattoDog2 = createCattoDog()

;[
  // make them all bark and meow
  cattoDog, cattoDog2
].forEach((ct) => {
  ct.bark() // BARKs
  ct.meow() // MEOWs
})
```

**obs-disp**

```js
// init API
import { createAPI } from 'obs-disp'
const { obsDispCreator, dispatchEvent, removeObs } = createAPI()
////////////

const createCattoDog = obsDispCreator(() => {
  const somePrivateVarWeCanAccessBelow = { a: 5 }

  return {
    'OBS_CREATE': () => {
      /* if init logic needed, called just after createCattoDog() */
      somePrivateVarWeCanAccessBelow.a = 10
    }
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

**Key Differences between the 2 examples**:

- imperative **vs** declarative communication with the objects (in the obs-disp example you only declare that you `dispatchEvent` - interested parties can handle that)
- the 1st doesn't scale (it's ad-hoc logic) **vs** the 2nd one has streamlined object creation, communication and removal (**you can build complete apps and flows like this and still keep the code clean**)
- if the methods on the first don't exist (`meow`, `bark`) - we get a problem **vs** if the methods (event handlers) on the 2nd don't exist - it's fine
- no built-in cleaning mechanism **vs** managed CRUD, so to speak (create, read, update, delete)
- **no other notable differences in this example - still using plain functions and objects**

## To the point - what's this in a few words?

`obs-disp` is a thin wrapper for writing straight-to-the-point JavaScript

- Create beautifully isolated objects (_components_, _observers_) via plain old functions
- Use them to build UI apps, games or extend legacy apps (fits anything really)
- Use the scope of the returned (created) function from `obsDispCreator` or `addObsDisp` (which returns the final handlers) to manage the state of the observer (e.g. the event handlers access this scope)
- Make observers communicate to one another seamlessly (_events_)
- No need for prior event definition (the merits of prototypal JavaScript)
- Tap into components' lifecycle - add logic per creation or removal of those objects
- Use your own custom events, define and reason about your flows - easily
- You could even create child components... more on this later

## Want more examples?

- [Extending the CattoDog example](repo-docs/examples/catto-dog-extended.md): for `obs-disp`'s power and flexibility to really shine,
let's dive deeper into what we can do with it: [repo-docs/examples/catto-dog-extended.md](repo-docs/examples/catto-dog-extended.md)
- [Usage Examples Repo](https://github.com/AweSkyBear/obs-disp-examples) for actual live examples!
Here is its [live examples page](https://aweskybear.github.io/obs-disp-examples/)
- Check out the **\<coming soon\>**[PSEUDO-EXAMPLES.md](TODO) for example architectures

## To the technical point - what's this?

- Very thin wrapper - events, components, **built-in** **Observer** / **Command** / **PubSub-like** pattern
- ability for _declarative_ event handling and dispatch, _uni-directional_ updates/flow
- each component created via the API is called **_OD_** (pronounced [o:di]) - **observer**, **dispatcher**, **observing-dispatcher** or **obs-disp** (because it can both listen and dispatch events);
  - this blurs the boundary between the Observer and the Command pattern (and has a PubSub-like flavor)
- Enables uni-directional flows/architectures and 0-coupling components
- Precise control-flow: seamless events handled by seamless-ly intergratable components (code right after you draw your flow-chart!)
- Component hierarchy is supported (you can add child observers) - has a few benefits (more on this later)
- Everything is functions and objects only - **no** `class`es, `this`, inheritance, `new` - keep it simple / focus on what your app will do, not how
- Useful when **dealing with many objects** and pieces of logic (imagine you could create an observer for any piece of logic,
- Useful for any kind of front-end: **html/dom**, **games (canvas)**, **webgl** (sure), **legacy apps**
  - e.g. a **few examples** for different kinds of apps:
    - **HTML5 apps** (e.g. SPAs, adding dynamic stuff to html pages): `createSidebar`, `createNavigationBar`, `createHTMLEvents` (a generic dispatcher of HTML events, surfacing these to other observers), HTML component ODs: `createInput`, `createButton`, `createModal`
    - **games**: `createGameLoop` (dispatches `update` event every frame)), `createPlayer`, `createLevel`, `createHealthBar` (those all to act as singletons/controllers); `createFoe` - create multiple instances whenever needed
    - **legacy / any JS applications**: use `addObsDisp` to inline an observer anywhere (allowing parts of an old app to communicate with other parts of it), remove it just as easily as part of lifecycle events
- Usable with **any library**: as an elegant state management (and object communication) solution for new or legacy apps
- Full TypeScript support for the best development experience

## Install

npm install obs-disp --save

## What's next?

Check out the [EXTENDED-README](repo-docs/EXTENDED-README.md) for even more details around the ideas and motivations behind the project.

## Starters

- [obs-disp-starter-basic](https://github.com/AweSkyBear/obs-disp-starter-basic) : obs-disp + Webpack + TypeScript + Prettier

## Useful links (coming soon)

**\<coming soon \>**

## Development status

**This project is in early-stage _public_ development**. It's core concepts however (and top-level API) have been tested
and are being tested to this point. The project itself has been tweaked quite a bit before even the first public release (of `0.*.*` versions).

**What this translates to**: do not expect a great deal of breaking changes to occur, however keep in mind that they
are possible and also allowed as per [Semantic Release's Initial Dev Phase - 0.\*.\*](https://semver.org/#how-should-i-deal-with-revisions-in-the-0yz-initial-development-phase) but will be kept to minimum (and outside of top-level APIs).

**Expect this README (and other .md files in repo-docs/) to get further updates.**
