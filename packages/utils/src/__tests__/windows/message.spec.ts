/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WindowMessenger } from '../../windows/message'

describe('windowMessenger', () => {
  let messenger: WindowMessenger
  let targetWindow: Window

  beforeEach(() => {
    // Mock target window (e.g. parent)
    targetWindow = {
      postMessage: vi.fn()
    } as any as Window

    // Mock window.addEventListener
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    if (messenger)
      messenger.destroy()
    vi.restoreAllMocks()
  })

  it('should initialize and add event listener', () => {
    messenger = new WindowMessenger({ target: targetWindow })
    expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
  })

  it('should send message to target', () => {
    messenger = new WindowMessenger({ target: targetWindow })
    messenger.send('test-type', { data: 1 })
    expect(targetWindow.postMessage).toHaveBeenCalledWith(
      { type: 'test-type', payload: { data: 1 } },
      '*'
    )
  })

  it('should receive message and call handler', () => {
    messenger = new WindowMessenger({ target: targetWindow })
    const handler = vi.fn()
    messenger.on('test-event', handler)

    // Simulate receiving message
    const event = new MessageEvent('message', {
      data: { type: 'test-event', payload: 'data' },
      origin: 'http://localhost'
    })

    // Trigger the bound handler directly or via dispatchEvent
    window.dispatchEvent(event)

    expect(handler).toHaveBeenCalledWith('data')
  })

  it('should filter by origin', () => {
    messenger = new WindowMessenger({ target: targetWindow, origin: 'http://allowed.com' })
    const handler = vi.fn()
    messenger.on('test-event', handler)

    // Wrong origin
    const badEvent = new MessageEvent('message', {
      data: { type: 'test-event', payload: 'data' },
      origin: 'http://evil.com'
    })
    window.dispatchEvent(badEvent)
    expect(handler).not.toHaveBeenCalled()

    // Correct origin
    const goodEvent = new MessageEvent('message', {
      data: { type: 'test-event', payload: 'data' },
      origin: 'http://allowed.com'
    })
    window.dispatchEvent(goodEvent)
    expect(handler).toHaveBeenCalledWith('data')
  })

  it('should unsubscribe', () => {
    messenger = new WindowMessenger({ target: targetWindow })
    const handler = vi.fn()
    const off = messenger.on('event', handler)

    off()

    const event = new MessageEvent('message', {
      data: { type: 'event', payload: 'data' }
    })
    window.dispatchEvent(event)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should destroy and remove listener', () => {
    messenger = new WindowMessenger({ target: targetWindow })
    messenger.destroy()
    expect(window.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function))
  })
})
