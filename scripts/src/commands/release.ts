import type { Lang } from '../types'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { versionBump } from 'bumpp'
import { prompt } from 'enquirer'
import { execCommand } from '../shared'
import { generateChangelogFiles } from './changelog'

/**
 * 版本管理：选择需要提升版本的包并创建自定义前缀标签
 * - 仅保留版本提升与标签创建功能（不生成 changelog、不推送）
 * - 多层级仓库中支持交互选择需要更新的包，未选中的包跳过
 * @param {string} [tagPrefix] 标签前缀（可选，留空则交互输入）
 * @returns {Promise<void>} 异步任务
 */
export async function release(tagPrefix?: string): Promise<void> {
  const repoRoot = await execCommand('git', ['rev-parse', '--show-toplevel'])

  // 收集可更新的 package.json 列表（排除 node_modules）
  const listRaw = await execCommand('git', ['-C', repoRoot, 'ls-files', '**/package.json'])
  const files = listRaw.split('\n').filter(Boolean).filter(p => !p.includes('node_modules'))
  const choices: { name: string, value: string }[] = []
  for (const rel of files) {
    try {
      const abs = path.join(repoRoot, rel)
      const json = JSON.parse(await readFile(abs, 'utf8'))
      if (json?.name)
        choices.push({ name: `${json.name} (${rel})`, value: rel })
    }
    catch {}
  }

  const sel = await prompt<{ selected: string[] }>([
    { name: 'selected', type: 'multiselect', message: '选择需要提升版本的包（空格选择，回车确认）', choices }
  ])
  const selected = sel?.selected ?? []
  if (!selected.length)
    return

  await versionBump({
    files: selected,
    all: false,
    tag: false,
    commit: 'chore(release): v%s'
  })

  // 使用首个选择的包版本作为标签版本
  const firstPkgPath = path.join(repoRoot, selected[0])
  const version = JSON.parse(await readFile(firstPkgPath, 'utf8')).version as string
  let prefix = tagPrefix
  if (prefix === undefined) {
    try {
      const res = await prompt<{ prefix: string }>([
        { name: 'prefix', type: 'text', message: '请输入标签前缀（可留空）' }
      ])
      prefix = res?.prefix?.trim() || ''
    }
    catch {
      prefix = ''
    }
  }
  const tagName = `${prefix ? `${prefix}-` : ''}v${version}`

  const exists = await execCommand('git', ['tag', '--list', tagName])
  if (!exists.trim()) {
    await execCommand('git', ['tag', '--annotate', '--message', `chore(projects): release ${tagName}`, tagName])
  }

  // 生成变更日志（默认：同时生成分组与时间轴两种样式，中文）
  const lang: Lang = 'zh-cn'
  await generateChangelogFiles({
    lang,
    format: 'both',
    groupOutput: 'CHANGELOG.md',
    timelineOutput: 'CHANGELOG_TIMELINE.md'
  })
}
