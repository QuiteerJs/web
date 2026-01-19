import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { execCommand } from '../shared'
import { gitCommitVerifyTz } from './git-commit-verify'

vi.mock('node:fs', () => ({
  readFileSync: vi.fn()
}))

vi.mock('../shared', () => ({
  execCommand: vi.fn()
}))

/**
 * 设置提交信息并模拟 git 根目录
 *
 * 用于模拟读取 `.git/COMMIT_EDITMSG` 的内容以及 git 根目录路径。
 *
 * @param message - 提交信息内容
 * @returns 无返回值
 * @throws {Error} 无
 *
 * @example
 * ```ts
 * mockCommitMessage('fix(v1.2.3): ok')
 * ```
 *
 * @remarks
 * - 会覆盖 `readFileSync` 与 `execCommand` 的 mock 行为
 *
 * @security
 * 不涉及安全敏感操作
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
function mockCommitMessage(message: string) {
  vi.mocked(execCommand).mockResolvedValue('/repo')
  vi.mocked(readFileSync).mockReturnValue(message)
  return undefined
}

describe('gitCommitVerifyTz', () => {
  it('should allow flexible version scopes', async () => {
    const versions = ['v1', 'v1.1', 'v1.1.1', 'v1.123-xxx']
    for (const version of versions) {
      mockCommitMessage(`fix(${version}): test`)
      await expect(gitCommitVerifyTz('zh-cn')).resolves.toBeUndefined()
    }
  })

  it('should throw when scope is not a version', async () => {
    mockCommitMessage('fix(feature): not ok')
    await expect(gitCommitVerifyTz('zh-cn')).rejects.toThrowError()
  })

  it('should skip verification when ignored', async () => {
    mockCommitMessage('chore: skip verify')
    await expect(gitCommitVerifyTz('zh-cn', [/^chore:/])).resolves.toBeUndefined()
  })
})
