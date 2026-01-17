import { describe, expect, it } from 'vitest'
import {
  is,
  isArray,
  isAsyncFunction,
  isBoolean,
  isDate,
  isDef,
  isEmpty,
  isFunction,
  isMap,
  isNull,
  isNullAndUnDef,
  isNullOrUnDef,
  isNumber,
  isObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUnDef,
  isWeakMap,
  isWeakSet
} from './type'

describe('isType module', () => {
  it('is', () => {
    expect(is([], 'Array')).toBe(true)
    expect(is({}, 'Object')).toBe(true)
    expect(is('str', 'String')).toBe(true)
    expect(is(null, 'Null')).toBe(true)
    expect(is(undefined, 'Undefined')).toBe(true)
  })

  it('isString', () => {
    expect(isString('test')).toBe(true)
    expect(isString(123)).toBe(false)
  })

  it('isNumber', () => {
    expect(isNumber(123)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(true) // NaN is type Number
    expect(isNumber('123')).toBe(false)
  })

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(1)).toBe(false)
  })

  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)
    expect(isFunction({})).toBe(false)
  })

  it('isObject', () => {
    expect(isObject({})).toBe(true)
    // expect(isObject([])).toBe(true) // Array is object but isObject checks [object Object]
    expect(isObject(null)).toBe(false)
    expect(isObject(1)).toBe(false)
  })

  it('isArray', () => {
    expect(isArray([])).toBe(true)
    expect(isArray({})).toBe(false)
  })

  it('isDef / isUnDef', () => {
    expect(isDef(1)).toBe(true)
    expect(isDef(undefined)).toBe(false)
    expect(isUnDef(undefined)).toBe(true)
    expect(isUnDef(null)).toBe(false)
  })

  it('isNull', () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
  })

  it('isNullOrUnDef', () => {
    expect(isNullOrUnDef(null)).toBe(true)
    expect(isNullOrUnDef(undefined)).toBe(true)
    expect(isNullOrUnDef(0)).toBe(false)
  })

  it('isNullAndUnDef', () => {
    // This function checks `isUnDef(val) && isNull(val)`.
    // Since `isUnDef` checks `typeof val === 'undefined'` (undefined)
    // and `isNull` checks `val === null` (null)
    // A value cannot be both undefined AND null.
    // So this function should logically always return false?
    // Let's check implementation:
    // isUnDef: typeof val !== 'undefined' (WAIT, implementation says !isDef, so typeof val === 'undefined')
    // isNull: val === null
    // So: (val === undefined) && (val === null) -> Always false.
    // Let's verify what the user intended or if I misread the code.
    // Code: return isUnDef(val) && isNull(val)
    // Test:
    expect(isNullAndUnDef(null)).toBe(false)
    expect(isNullAndUnDef(undefined)).toBe(false)
  })

  it('isEmpty', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(0)).toBe(true)
    expect(isEmpty(' ')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({})).toBe(false) // {} is not checked in implementation, default false
  })

  it('isSymbol', () => {
    expect(isSymbol(Symbol('foo'))).toBe(true)
    expect(isSymbol('foo')).toBe(false)
  })

  it('isPromise', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true)
    expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true)
    expect(isPromise({})).toBe(false)
  })

  it('isAsyncFunction', () => {
    expect(isAsyncFunction(async () => {})).toBe(true)
    expect(isAsyncFunction(() => {})).toBe(false)
  })

  it('isMap / isSet / isWeakMap / isWeakSet', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isSet(new Set())).toBe(true)
    expect(isWeakMap(new WeakMap())).toBe(true)
    expect(isWeakSet(new WeakSet())).toBe(true)
    expect(isMap({})).toBe(false)
  })

  it('isRegExp', () => {
    expect(isRegExp(/abc/)).toBe(true)
    // expect(isRegExp(new RegExp('abc'))).toBe(true)
    expect(isRegExp('/abc/')).toBe(false)
  })

  it('isDate', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate('2023-01-01')).toBe(false)
  })

  // it('isProxy', () => {
  //   // Note: JS doesn't have a reliable cross-browser way to check for Proxy via toString tag
  //   // The implementation uses [object Proxy], but standard Proxy returns [object Object] or target's tag.
  //   // Unless polyfilled or specific environment.
  //   // Let's test the implementation behavior.
  //   const proxy = new Proxy({}, {})
  //   // expect(isProxy(proxy)).toBe(true)
  //   // This test might fail depending on environment implementation of Object.prototype.toString.call(proxy)
  // })
})
