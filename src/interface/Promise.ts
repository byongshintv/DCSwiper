
type Resolve<T> = (value?: T | PromiseLike<T> | undefined) => void
type Reject = (reason?: any) => void

export {Resolve, Reject}