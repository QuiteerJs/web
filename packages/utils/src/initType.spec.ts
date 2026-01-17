import { describe, expect, it } from 'vitest'
import {
  initArray,
  initBoolean,
  initFunction,
  initNull,
  initNumber,
  initObject,
  initString,
  initSymbol,
  initType,
  initUndefined
} from './initType'

describe('initType module', () => {
  it('should return initial values by initType(type)', () => {
    expect(initType('string')).toBe('')
    expect(initType('number')).toBe(0)
    expect(initType('boolean')).toBe(false)
    expect(initType('undefined')).toBeUndefined()
    expect(initType('null')).toBeNull()
    expect(initType('object')).toEqual({})
    expect(initType('array')).toEqual([])

    const fn = initType('function')
    expect(typeof fn).toBe('function')
    expect(fn()).toBeUndefined()

    const s = initType('symbol')
    expect(typeof s).toBe('symbol')
  })

  it('should return new references for object and array', () => {
    expect(initType('object')).not.toBe(initType('object'))
    expect(initType('array')).not.toBe(initType('array'))
  })

  it('should keep compatibility for initType(data, type)', () => {
    expect(initType('ignored', 'string')).toBe('')
    expect(initType(123, 'number')).toBe(0)
  })

  it('should return initial values by specific initializers', () => {
    expect(initString()).toBe('')
    expect(initNumber()).toBe(0)
    expect(initBoolean()).toBe(false)
    expect(initUndefined()).toBeUndefined()
    expect(initNull()).toBeNull()
    expect(initObject()).toEqual({})
    expect(initArray()).toEqual([])

    const fn = initFunction()
    expect(typeof fn).toBe('function')
    expect(fn()).toBeUndefined()

    const s = initSymbol()
    expect(typeof s).toBe('symbol')
  })
})
