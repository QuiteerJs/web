import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { versionBump } from 'bumpp'
import { execCommand } from '../shared'

/**
 * 发布流程：版本号提升、生成变更日志、提交与打标签
 * - 先统一完成版本号提升与提交（禁用内置打标签以避免已存在标签导致中断）
 * - 读取根 package.json 的版本号，若标签不存在则创建并推送
 * @param {string} execute 发布前执行的命令
 * @param {boolean} push 是否推送提交/标签
 * @returns {Promise<void>} 异步任务
 */
export async function release(execute: string, push = true): Promise<void> {
  await versionBump({
    files: ['**/package.json', '!**/node_modules'],
    execute,
    all: true,
    tag: false,
    commit: 'chore(projects): release v%s',
    push
  })

  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])
  const pkgPath = path.join(repoRoot, 'package.json')
  const content = await readFile(pkgPath, 'utf8')
  const version = JSON.parse(content).version as string
  const tagName = `v${version}`

  const exists = await execCommand('git', ['tag', '--list', tagName])
  if (!exists.trim()) {
    await execCommand('git', ['tag', '--annotate', '--message', `chore(projects): release ${tagName}`, tagName])
    if (push)
      await execCommand('git', ['push', '--tags'])
  }
}
