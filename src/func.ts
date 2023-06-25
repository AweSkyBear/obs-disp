import { complement, concat, isNil, mergeWith, uniq } from 'ramda'
import { Func } from './types'

export {
  always,
  complement,
  pathOr,
  isEmpty,
  pipe,
  when,
  mergeDeepRight as merge,
  and,
  omit,
  either,
  any,
  filter,
  clone,
  isNil,
  compose,
  defaultTo,
  equals,
  propOr,
  prop,
  path,
  pick,
  is,
  split,
} from 'ramda'

export const isNotNil = complement(isNil)

export const defer = (cb: Func<any, any>, timeout?: number) => {
  setTimeout(cb, timeout)
}

export const asArray = <T>(val: T | T[]) => (val instanceof Array ? val : [val]) as T[]

export const deepMerge = <T extends object | Array<any>>(v1: T, v2: T): T => {
  if (Array.isArray(v1) && Array.isArray(v2)) {
    return uniq(concat(v1, v2) as any) as T
  } else if (typeof v1 === 'object' && typeof v2 === 'object' && !isNil(v1) && !isNil(v2)) {
    return mergeWith(deepMerge, v1, v2)
  } else {
    return v2
  }
}

export const removeObjNils = (obj: object) =>
  Object.keys(obj).reduce((final, key) => {
    isNotNil(obj[key]) && (final[key] = obj[key])
    return final
  }, {})
