/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WebSocketClient } from './websocket'

// Mock WebSocket
class MockWebSocket {
  url: string
  protocols?: string | string[]
  readyState: number = 0 // CONNECTING

  onopen: ((event: any) => void) | null = null
  onmessage: ((event: any) => void) | null = null
  onclose: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null

  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  constructor(url: string, protocols?: string | string[]) {
    this.url = url
    this.protocols = protocols
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN
      this.onopen?.({} as any)
    }, 10)
  }

  send = vi.fn()
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.({} as any)
  })
}

describe('webSocketClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    globalThis.WebSocket = MockWebSocket as any
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should connect automatically', () => {
    const ws = new WebSocketClient('ws://test.com')
    // Wait for connection
    vi.advanceTimersByTime(100)
    expect((ws as any).ws).toBeTruthy()
    expect((ws as any).ws?.readyState).toBe(MockWebSocket.OPEN)
    ws.close()
  })

  it('should send messages', () => {
    const ws = new WebSocketClient('ws://test.com')
    vi.advanceTimersByTime(100)

    ws.send('hello')
    expect((ws as any).ws?.send).toHaveBeenCalledWith('hello')

    ws.send({ a: 1 })
    expect((ws as any).ws?.send).toHaveBeenCalledWith(JSON.stringify({ a: 1 }))

    ws.close()
  })

  it('should handle incoming messages', () => {
    const ws = new WebSocketClient('ws://test.com')
    const onMessage = vi.fn()
    ws.on('message', onMessage)

    vi.advanceTimersByTime(100)

    // Simulate message
    const msgEvent = { data: JSON.stringify({ type: 'test' }) }
    ;(ws as any).ws!.onmessage!(msgEvent as any)

    expect(onMessage).toHaveBeenCalledWith({ type: 'test' }, msgEvent)

    ws.close()
  })

  it('should reconnect on close', () => {
    const ws = new WebSocketClient('ws://test.com', {
      reconnect: { interval: 100 }
    })

    vi.advanceTimersByTime(100)

    // Simulate unexpected close (not calling ws.close())
    // We access private ws and call onclose
    ;(ws as any).ws!.onclose!({} as any)

    // Should be in reconnect wait
    vi.advanceTimersByTime(100)

    // Should have created a new websocket
    expect((ws as any).ws).toBeTruthy()

    ws.close()
  })

  it('should send heartbeat', () => {
    const ws = new WebSocketClient('ws://test.com', {
      heartbeat: { interval: 1000, message: 'ping' }
    })

    vi.advanceTimersByTime(100) // Connect

    // Wait for heartbeat
    vi.advanceTimersByTime(1000)
    expect((ws as any).ws?.send).toHaveBeenCalledWith('ping')

    ws.close()
  })
})
