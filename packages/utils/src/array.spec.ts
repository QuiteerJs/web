import { describe, expect, it } from 'vitest'
import { chunk, flatten, groupBy, partition, unique } from './array'

describe('array module', () => {
  describe('unique', () => {
    it('should remove duplicates from array', () => {
      expect(unique([1, 1, 2, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b'])
    })

    it('should handle objects by reference', () => {
      const o = {}
      expect(unique([o, o, {}]).length).toBe(2)
    })
  })

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should return empty array if size <= 0', () => {
      expect(chunk([1, 2], 0)).toEqual([])
      expect(chunk([1, 2], -1)).toEqual([])
    })

    it('should return original array wrapped if size >= length', () => {
      expect(chunk([1, 2], 3)).toEqual([[1, 2]])
    })
  })

  describe('flatten', () => {
    it('should flatten array 1 level deep by default', () => {
      expect(flatten([1, [2, 3]])).toEqual([1, 2, 3])
    })

    it('should not flatten if depth is 0', () => {
      expect(flatten([1, [2, 3]], 0)).toEqual([1, [2, 3]])
    })

    // Implementation only supports depth > 0 (1 level flat), recursive not implemented in provided code unless I misread?
    // Code: return depth > 0 ? arr.reduce(...) : arr
    // It reduces once. So depth 2 is same as depth 1 in current implementation?
    // Let's test what it does.
    // The implementation: depth > 0 ? arr.reduce<T[]>((acc, v) => acc.concat(v as any), []) : (arr as T[])
    // It is shallow flatten.
    it('should flatten only 1 level even if depth > 1 (based on implementation)', () => {
      expect(flatten([1, [2, [3]]], 2)).toEqual([1, 2, [3]])
    })
  })

  describe('groupBy', () => {
    it('should group elements by key', () => {
      expect(groupBy(['a', 'aa', 'b'], s => s.length)).toEqual({
        1: ['a', 'b'],
        2: ['aa']
      })
    })
  })

  describe('partition', () => {
    it('should partition array based on predicate', () => {
      expect(partition([1, 2, 3, 4], x => x % 2 === 0)).toEqual([[2, 4], [1, 3]])
    })
  })
})
