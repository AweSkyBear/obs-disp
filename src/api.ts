import uniqid from 'uniqid'
import { IEvent } from './events'
import { defer } from './func'
import {
  IObserverTreeNode,
  IObserver,
  IObserverOptions,
  __addObsDisp,
  __dispatchEvent,
  __obsDispCreator,
  __removeObs,
  __removeObsById,
  __removeAllObservers,
  __createThrottledDispatch,
  __checkObsExists,
  __checkObsExistsById,
} from './obs-disp'
import { TObserverByIdMap, __createObserversMap } from './obsMap'
import { __getAllObservers, __getObsById } from './traverse'
import { Func } from './types'

export interface ICreateObsDispAPIParams
  extends Partial<{
    onEvent: Func<IEvent, void>
    onObsCreated: Func<IObserverOptions, void>
    onObsRemoved: Func<IObserverOptions, void>
    onWarn: Func<{ msg: string; params?: object }, void>
  }> {}

export interface IObsDispAPI extends ReturnType<typeof createAPI> {}

type TApiId = string

export type TGetObserversMap = Func<never, TObserverByIdMap>

const __apiObserverMaps = new Map<TApiId, TObserverByIdMap>()

const __getObserversMap = (apiId: TApiId) => __apiObserverMaps.get(apiId)

/**
 * Creates an isolated instance of the obs-disp API. E.g.
 * Created observers and dispatched events are contained
 * within the scope of this API (this can be viewed as the *observable*
 * instance)
 * @param params ICreateObsDispAPIParams
 * @returns IObsDispAPI
 */
export const createAPI = (params: ICreateObsDispAPIParams = {}) => {
  const apiId = uniqid('OD-API-')

  const observersMap = __createObserversMap()

  __apiObserverMaps.set(apiId, observersMap)

  const __getMyMap = () => __getObserversMap(apiId)

  const __getChildren = (obs: IObserver) => {
    const children: IObserver[] = []
    obs.forChildren((obs) => children.push(obs))
    return children
  }

  const _getObsTree = (obs: IObserver): IObserverTreeNode => ({
    ...obs.options,
    children: __getChildren(obs).map(_getObsTree),
  })

  const _dispatchEvent = __dispatchEvent(params, __getMyMap)
  const api = {
    // create
    addObsDisp: __addObsDisp(params, __getMyMap),
    obsDispCreator: __obsDispCreator(params, __getMyMap),

    // dispatch events
    dispatchEvent: _dispatchEvent,
    dispatchDeferredEvent: <T extends IEvent>(...args: Parameters<typeof _dispatchEvent<T>>) =>
      defer(() => __dispatchEvent(params, __getMyMap)<T>(...args)),

    createThrottledDispatch: __createThrottledDispatch(params, __getMyMap),

    // checks
    checkObsExists: __checkObsExists(__getMyMap),
    checkObsExistsById: __checkObsExistsById(__getMyMap),

    // remove
    removeAllObservers: __removeAllObservers(params, __getMyMap),
    removeObs: __removeObs(params, __getMyMap),
    removeObsById: __removeObsById(params, __getMyMap),

    // get
    getObsById: (id: string) => __getObsById(__getMyMap(), id),
    getAllObservers: __getAllObservers(__getMyMap()),

    getObserversTree: () =>
      Array.from(__getMyMap().values())
        .filter((obs) => !obs.parentId)
        .map(_getObsTree),
  }

  return api
}
