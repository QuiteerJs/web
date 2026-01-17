import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TimedArray } from './timed-array'

describe('timedArray', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should push fixed values at interval', () => {
    const onPush = vi.fn()
    const ta = new TimedArray<number>({
      fixedPushValue: 1,
      fixedInterval: 100,
      randomPushValue: () => 0
    })
    ta.onPush = onPush

    ta.start()
    vi.advanceTimersByTime(100)
    expect(onPush).toHaveBeenCalledWith(1)

    vi.advanceTimersByTime(100)
    expect(onPush).toHaveBeenCalledTimes(2)

    ta.stop()
  })

  it('should pop fixed values at interval', () => {
    const onPop = vi.fn()
    const ta = new TimedArray<number>({
      enableFixedPop: true,
      fixedInterval: 100,
      randomPushValue: () => 0
    })
    ta.onPop = onPop
    ta.push(1)
    ta.push(2)

    ta.start()
    vi.advanceTimersByTime(100)
    expect(onPop).toHaveBeenCalledTimes(1)
    expect(ta.getArray().length).toBe(1)

    vi.advanceTimersByTime(100)
    expect(onPop).toHaveBeenCalledTimes(2)
    expect(ta.getArray().length).toBe(0)

    ta.stop()
  })

  it('should push random values', () => {
    const onRandomPush = vi.fn()
    const ta = new TimedArray<number>({
      randomPushValue: () => 99,
      randomIntervalRange: [100, 200]
    })
    ta.onRandomPush = onRandomPush

    ta.start()
    // Should happen between 100 and 200ms
    vi.advanceTimersByTime(200)
    expect(onRandomPush).toHaveBeenCalled()
    expect(ta.getArray()).toContain(99)

    ta.stop()
  })

  it('should clear array', () => {
    const ta = new TimedArray<number>({ randomPushValue: () => 0 })
    ta.push(1)
    ta.clear()
    expect(ta.getArray()).toEqual([])
  })
})
