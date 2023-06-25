import { IObserver, IObserverOptions, ON_CREATE_OBS_FIELD } from '../obs-disp'
import { constructEvents, IEvent } from '../events'
import { payloadPath, payloadProp } from '../getters'
import { Func } from '../types'
import { always, compose } from 'ramda'

type TObsDispEventName = 'OBS_CREATE' | 'OBS_REMOVE' | 'OBS_EXISTING_RE'

export interface IObsDispEvent extends IEvent {
  name: TObsDispEventName
}

export const obsDispEvents = constructEvents<TObsDispEventName>([
  'OBS_CREATE',
  'OBS_REMOVE',
  'OBS_EXISTING_RE',
])

export interface IObsDispOnCreateEvent extends IObsDispEvent {
  payload: {
    observerOptions: IObserverOptions
  }
}

/** Handlers for the ObsCreateEvent */
export const ObsDispCreate = {
  useObs: (cb: Func<IObserver, void>) => (ev: IEvent) =>
    compose(always(ev), cb, payloadPath<IObserver>([ON_CREATE_OBS_FIELD, 'instance']))(ev),
}
