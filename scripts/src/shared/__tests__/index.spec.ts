import { execa } from 'execa'
import { describe, expect, it, vi } from 'vitest'
import { execCommand } from '../index'

vi.mock('execa', () => ({
  execa: vi.fn()
}))

describe('execCommand', () => {
  it('should execute command and return stdout', async () => {
    vi.mocked(execa).mockResolvedValue({ stdout: ' success ' } as any)
    const result = await execCommand('ls', ['-la'])
    expect(execa).toHaveBeenCalledWith('ls', ['-la'], undefined)
    expect(result).toBe('success')
  })

  it('should return empty string if no stdout', async () => {
    vi.mocked(execa).mockResolvedValue({ stdout: undefined } as any)
    const result = await execCommand('ls', ['-la'])
    expect(result).toBe('')
  })
})
