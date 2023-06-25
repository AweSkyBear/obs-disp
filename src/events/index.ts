import { always, complement, compose } from '../func'

import { IObserver, IObserverOptions } from '../obs-disp'
import { Func, Predicate } from '../types'

export interface IEvent {
  name: string
  payload?: Record<any, any>
}

export type TEventTarget = IObserver | IObserver[] | 'all' | Predicate<IObserverOptions>

export const isFullEvent = (evOrEvName: IEvent | IEvent['name']): evOrEvName is IEvent =>
  typeof evOrEvName === 'object'
export const isEventName = complement(isFullEvent)

/**
 * Useful when you'd like type-hinting on event names (e.g. using TypeScript).
 * Creates a map where we can call someEventDomain.<EVENT_NAME> from passing the event names
 * as an array [EV_NAME_1, EV_NAME_2, ...]
 *
 * @example
 * // First define an union type of all the events for a particular domain/component in your app.
 *
 * type TNavigationEvent = 'NAVIGATION_PAGE_CHANGE' | 'NAVIGATION_MENU_CHANGE' | 'NAVIGATION_ITEM_COLLAPSE'
 *
 * // Then use this function to generate a map like <TNavigationEvent: TNavigationEvent>, so that when
 * // handling events, you can do
 *
 * export const navigationEvents = constructEvents<TNavigationEvent>([
 *  'NAVIGATION_PAGE_CHANGE',
 *  'NAVIGATION_MENU_CHANGE',
 *  'NAVIGATION_ITEM_COLLAPSE'
 * ])
 *
 * ...
 *
 * // you get type-completion for navigationEvents.*
 * dispatchEvent(navigationEvents.NAVIGATION_PAGE_CHANGE, { page: 'about' })
 *
 * @param eventNames The array of event names
 * @returns
 */
export const constructEvents = <T extends IEvent['name']>(eventNames: Array<T>) => {
  return eventNames.reduce((accum, evName) => {
    accum[evName as string] = evName
    return accum
  }, {}) as Record<T, T>
}

/**
 * General handlers for the ObsCreateEvent
 * Each one is composable
 */
export const Ev = {
  useEvent: (cb: Func<IEvent, void>) => (ev: IEvent) => compose(always(ev), cb)(ev),
}
