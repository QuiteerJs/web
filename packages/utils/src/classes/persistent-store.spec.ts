import { beforeEach, describe, expect, it } from 'vitest'
import { createWebStorageAdapter, PersistentStore } from './persistent-store'

// Mock Storage
class MockStorage {
  store = new Map<string, string>()
  getItem(key: string) { return this.store.get(key) || null }
  setItem(key: string, value: string) { this.store.set(key, value) }
  removeItem(key: string) { this.store.delete(key) }
  clear() { this.store.clear() }
}

describe('persistentStore', () => {
  let mockStorage: MockStorage
  let store: PersistentStore

  beforeEach(() => {
    mockStorage = new MockStorage()
    // We need to reset the singleton map for testing, but it's private static.
    // Since we pass different namespaces, it's fine.
    // Or we can use a fresh adapter for each test with a unique namespace.
    const adapter = createWebStorageAdapter(mockStorage)
    store = PersistentStore.getInstance(`test-${Math.random()}`, adapter)
  })

  it('should set and get values', () => {
    store.set('key', 'value')
    expect(store.get('key')).toBe('value')
  })

  it('should return default value if key missing', () => {
    expect(store.get('missing', 'default')).toBe('default')
  })

  it('should check if key exists', () => {
    store.set('key', 'value')
    expect(store.has('key')).toBe(true)
    expect(store.has('missing')).toBe(false)
  })

  it('should remove key', () => {
    store.set('key', 'value')
    store.remove('key')
    expect(store.has('key')).toBe(false)
  })

  it('should list keys', () => {
    store.set('a', 1)
    store.set('b', 2)
    expect(store.keys()).toEqual(expect.arrayContaining(['a', 'b']))
  })

  it('should clear store', () => {
    store.set('a', 1)
    store.clear()
    expect(store.keys()).toEqual([])
    expect(store.has('a')).toBe(false)
  })

  it('should export and import data', () => {
    store.set('a', 1)
    const data = store.export()
    expect(data).toEqual({ a: 1 })

    store.clear()
    store.import({ b: 2 })
    expect(store.get('b')).toBe(2)
  })
})
