import { describe, expect, it } from 'vitest'
import {
  deepClone,
  deepMerge,
  get,
  isEmpty,
  isObject,
  isPlainObject,
  omit,
  pick,
  set
} from '../object'

describe('object module', () => {
  describe('isObject', () => {
    it('should return true for object types (excluding null)', () => {
      expect(isObject({})).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject(null)).toBe(false)
      expect(isObject(1)).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('should return false for non-plain objects', () => {
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject([])).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('  ')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmpty('a')).toBe(false)
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty({ a: 1 })).toBe(false)
      expect(isEmpty(0)).toBe(false) // 0 is not considered empty by implementation
    })
  })

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const original = { a: 1, b: { c: 2 }, d: [3, 4] }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.d).not.toBe(original.d)
    })
  })

  describe('deepMerge', () => {
    it('should deep merge objects', () => {
      const a = { a: 1, b: { c: 1 }, d: [1] }
      const b = { b: { d: 2 }, d: [2] }
      const result = deepMerge(a, b)

      expect(result).toEqual({ a: 1, b: { c: 1, d: 2 }, d: [1, 2] })
    })
  })

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('get', () => {
    it('should get value by path', () => {
      const obj = { a: { b: [{ c: 1 }] } }
      expect(get(obj, 'a.b[0].c')).toBe(1)
      expect(get(obj, 'a.x', 'default')).toBe('default')
    })
  })

  describe('set', () => {
    it('should set value by path', () => {
      const obj: any = {}
      set(obj, 'a.b[0].c', 1)
      expect(obj).toEqual({ a: { b: [{ c: 1 }] } })
    })
  })
})
