import { bindAll, functions } from 'lodash'

export const thistle = (fn) => {
  return function (...args) {

    // gratuitous saving of 'this'
    var ctx = this

    // binding of provided fields
    bindAll(ctx, ...functions(ctx))

    // prepend ctx to the arg list of the provided function and call through to it
    return fn.apply(undefined, [ctx, ...args])
  }
}
