# thistle

Thistle: (t͟hisˌəl) Utilize only JS' good parts by ridding yourself of _this_.

# How to use
`npm install -S thistle`

Then substitute:

```
thistle(({field}, arg) => console.log('this.field was', field))
```

For: 

```
function (arg) { console.log('this.field was', this.field) }
```

# Why?

* Remove **every** reference to `this` in your code-base if you want
* Yet enjoy the same run-time behavior
* Refactoring/moving code becomes much easier
* Easy to see which parts of the context are used within the function
* Use ES6 arrow functions with impunity
* Use simple function calls - `this.dance()` becomes simply `dance()` 

# Specification

```js
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
    meth: function(){ return 'meth:' + this.ctx1}
  }
  let mixedFn = ({ctx1, meth}, arg1) => {
    return [ctx1, meth(), arg1].join('/')
  }

  // Now test it
  it('should return a function, for fun and profit', () => {
    const result = thistle(fieldsFn)
    expect(result).to.be.a.function
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
})
```

# Thanks

- Douglas Crockford
- ES6 for finally having cool language features
- MC Hammer (who also advised us not to touch this)
- Grateful Dead (for Ripple)
