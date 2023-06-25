export type Func<T, U> = (x?: T) => U

export type Primitive = bigint | boolean | null | number | string | symbol | undefined

export type Predicate<T> = (item: T) => boolean
