import { describe, expect, it } from 'vitest'
import { HistoryManager } from './history-manager'

describe('historyManager', () => {
  it('should initialize with maxSize', () => {
    const hm = new HistoryManager(5)
    expect(hm.historySize()).toBe(0)
  })

  it('should record values', () => {
    const hm = new HistoryManager<number>(5)
    hm.record(1)
    hm.record(2)
    expect(hm.getCurrentValue()).toBe(2)
    expect(hm.historySize()).toBe(2)
  })

  it('should undo steps', () => {
    const hm = new HistoryManager<number>(5)
    hm.record(1)
    hm.record(2)
    hm.record(3)

    expect(hm.undo()).toBe(2)
    expect(hm.getCurrentValue()).toBe(2)

    expect(hm.undo()).toBe(1)
    expect(hm.getCurrentValue()).toBe(1)
  })

  it('should not undo past beginning', () => {
    const hm = new HistoryManager<number>(5)
    hm.record(1)
    expect(hm.undo()).toBeUndefined() // Undo the only record goes to empty state
    expect(hm.undo()).toBeUndefined()
  })

  it('should redo by recording new value (truncate future)', () => {
    const hm = new HistoryManager<string>(5)
    hm.record('a')
    hm.record('b')
    hm.record('c')

    hm.undo() // at 'b'
    hm.undo() // at 'a'

    hm.record('d') // Should discard 'b' and 'c'

    expect(hm.getFullHistory().map(h => h.value)).toEqual(['a', 'd'])
    expect(hm.getCurrentValue()).toBe('d')
  })

  it('should respect maxSize', () => {
    const hm = new HistoryManager<number>(3)
    hm.record(1)
    hm.record(2)
    hm.record(3)
    hm.record(4)

    // Should have [2, 3, 4]
    expect(hm.historySize()).toBe(3)
    expect(hm.getFullHistory().map(h => h.value)).toEqual([2, 3, 4])
  })

  it('should clear history', () => {
    const hm = new HistoryManager<number>(3)
    hm.record(1)
    hm.clear()
    expect(hm.historySize()).toBe(0)
    expect(hm.getCurrentValue()).toBeUndefined()
  })
})
