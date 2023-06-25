import { IObserver } from './obs-disp'

type TObserverId = string

export type TObserverByIdMap = Map<TObserverId, IObserver>

export const __createObserversMap = (): TObserverByIdMap => new Map()

export const __addOD = (map: TObserverByIdMap, obs: IObserver, parentObs?: IObserver) => {
  if (parentObs) obs.parentId = parentObs.options.id
  return map.set(obs.options.id, obs)
}

export const _createObserversMap = (): TObserverByIdMap => new Map()
