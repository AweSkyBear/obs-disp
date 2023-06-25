import { compose, path, pathOr, prop, propOr, when, is, split } from './func'
import { IEvent } from './events'

const payloadOrEmptyObj = propOr({}, 'payload')

export const payload = <P>(ev: IEvent) => payloadOrEmptyObj<IEvent, P>(ev)
export const payloadProp = <T>(_prop: string) =>
  compose<[IEvent], string, T>(prop(_prop) as any, payloadOrEmptyObj)
export const payloadPropOr = <T>(prop: string, defaultVal: any) =>
  compose<any, string, T>(propOr(defaultVal, prop), payloadOrEmptyObj)
export const payloadPath = <T>(_path: Array<string | number> | string) =>
  compose<[IEvent], string, T>(path(when(is(String), split('.'))(_path)), payloadOrEmptyObj)
export const payloadPathOr = <T>(path: Array<string | number> | string, defaultVal: any) =>
  compose<[IEvent], string, T>(
    pathOr(defaultVal, when(is(String), split('.'))(path)),
    payloadOrEmptyObj,
  )
