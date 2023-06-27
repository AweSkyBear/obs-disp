# Obs Disp

This is **for all the folks** who are wondering **what's a right way to write** JavaScript.

For **everyone who struggles** to understand **how to structure** an arbitrary app for the browser. Be it small or large.

And about **how to keep the code clean**, while retaining sanity, not bogging down into extreme amounts of painful implementation details. **Without being a genius**.

## The problem

What's the simplest form JavaScript can take?

Let's build real-life clean-code easily extensible apps! **Now**

## What's this?  

<div id="dialogue"/>

### Let's start with a dialogue...
> _Somewhere in a parallel universe_

_JavaScript and a Computer talking_

<img src="repo-docs/comp-vs-js.svg"  width="500">

_Imagine the Computer has a squeaky voice_

> - **Computer**: Lovely JavaScript, is that you???
> - **JavaScript**: Yes, that's me!!!
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

## Pure JS vs Obs-Disp example

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

**Extending the CattoDog example**: for `obs-disp`'s power and flexibility to really shine,
let's dive deeper into what we can do with it: [repo-docs/examples/catto-dog-extended.md](repo-docs/examples/catto-dog-extended.md)

Check out the **\<coming soon\>**[PSEUDO-EXAMPLES.md](TODO) for example architectures

Check out the **\<coming soon\>**[Usage Examples Repo](TODO) for actual code examples!

## To the technical point - what's this?

- Very thin wrapper - events, components, **built-in** **Observer** / **Command** / **PubSub-like** pattern
- ability for _declarative_ event handling and dispatch, _uni-directional_ updates/flow
- each component created via the API is called **_OD_** (pronounced [odi]) - **observer**, **dispatcher**, **observing-dispatcher** or **obs-disp** (because it can both listen and dispatch events);
  - this blurs the boundary between the Observer and the Command pattern (and has a PubSub-like flavor)
- Enables uni-directional flows/architectures and 0-coupling components
- Precise control-flow: seamless events handled by seamless-ly intergratable components (code right after you draw your flow-chart!)
- Component hierarchy is supported (you can add child observers) - has a few benefits (more on this later)
- Everything is functions and objects only - **no** `class`es, `this`, inheritance, `new` - keep it simple / focus on what your app will do, not how
- Useful when **dealing with many objects** and pieces of logic (imagine you could create an observer for any piece of logic,
- Useful for any kind of front-end: **html/dom**, **games (canvas)**, **webgl** (sure)
  - e.g. a few examples for different kinds of apps:
    - **HTML5 apps** (e.g. SPAs, adding dynamic stuff to html pages): `createSidebar`, `createNavigationBar`, `createHTMLEvents` (a generic dispatcher of HTML events, surfacing these to other observers), HTML component ODs: `createInput`, `createButton`
    - **games**: `createGameLoop` (dispatches `update` event every frame)), `createPlayer`, `createLevel`, `createHealthBar`
    - **legacy / any JS applications**: use `addObsDisp` to inline an observer anywhere (allowing parts of an old app to communicate with other parts of it), remove it just as easily as part of lifecycle events
- Usable with **any library**: as an elegant state management (and object communication) solution for new or legacy apps
- Inject inside of any existing code - **legacy apps** too can benefit from this
- Full TypeScript support for the best development experience

## Install

npm install obs-disp --save

## What's next?

Check out the [EXTENDED-README](repo-docs/EXTENDED-README.md) for even more details around the ideas and motivations behind the project.

## Starters (coming soon)

- [obs-disp-starter-basic](https://github.com/AweSkyBear/obs-disp-starter-basic) : obs-disp + Webpack + TypeScript + Prettier

## Useful links (coming soon)

**\<coming soon \>**

## Development status

**This project is in early-stage _public_ development**. It's core concepts however (and top-level API) have been tested
and are being tested to this point. The project itself has been tweaked quite a bit before even the first public release (of `0.*.*` versions).

**What this translates to**: do not expect a great deal of breaking changes to occur, however keep in mind that they
are possible and also allowed as per [Semantic Release's Initial Dev Phase - 0.\*.\*](https://semver.org/#how-should-i-deal-with-revisions-in-the-0yz-initial-development-phase) but will be kept to minimum (and outside of top-level APIs).

**Expect this README (and other .md files in repo-docs/) to get further updates.**
