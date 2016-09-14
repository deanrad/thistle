import {expect} from 'chai'
import {thistle} from '../'
const {describe, it} = global

describe('thistle(fn)', () => {
  // Simple fields on this should be destructurable
  let fieldsFn = ({ctx1}, arg1) => {
    return `${ctx1}:${arg1}`
  }

  let fieldsContext = {
    ctx1: 'ctx1Val',
    ctx2: 'ctx2Val'
  }

  // Methods of the context object should be bound to it
  // so you can invoke them stand-alone (meth will work correctly)
  let mixedContext = {
    ctx1: 'ctx1Val',
    meth: function () { return 'meth:' + this.ctx1}
  }

  let mixedFn = ({ctx1, meth}, arg1) => {
    return [ctx1, meth(), arg1].join('/')
  }

  // Now test it
  it('should return a function, for fun and profit', () => {
    const result = thistle(fieldsFn)
    expect(result).to.be.a('function')
  })

  it('which prepends `this` as its first argument, for fun and profit', () => {
    const result = thistle(fieldsFn)
    const retVal = result.call(fieldsContext, 'arg1Val')
    expect(retVal).to.equal('ctx1Val:arg1Val')
  })

  it('and binds methods of `this` to itself, for fun and profit', () => {
    const result = thistle(mixedFn)
    const retVal = result.call(mixedContext, 'arg1Val')
    expect(retVal).to.equal('ctx1Val/meth:ctx1Val/arg1Val')
  })

  it('while still allowing you to set properties upon it', () => {
    const contextObj = {ctx1: 'ctx1Val'}
    const haterade = 'Only evil functions mutate their arguments!'
    const result = thistle((context) => {
      context.newProp = haterade
    })

    result.call(contextObj)

    expect(contextObj).to.have.property('newProp', haterade)
  })
})
