import { IObserver } from './obs-disp'
import { TObserverByIdMap } from './obsMap'

export const __getObsById = (map: TObserverByIdMap, obsId: string) => map.get(obsId)

export const __getAllObservers = (map: TObserverByIdMap) => () => Array.from(map.values())

export const __findTopLevelObsParent = (map: TObserverByIdMap, id: string) => {
  const obs = __getObsById(map, id)
  let topObs = obs
  while (topObs?.parentId) {
    topObs = __getObsById(map, topObs.parentId)
  }
  return topObs
}

const ____getChildren = (obs: IObserver, allChildren: IObserver[] = []) => {
  if (!obs) return []

  obs.forChildren((child) => {
    allChildren.push(child)
    ____getChildren(child, allChildren)
  })

  return allChildren
}

/** Get all-level nested children */
export const __getAllChildren = (obs: IObserver) => ____getChildren(obs)
