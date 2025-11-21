import { bgGreen, lightGreen, white } from 'kolorist'
import { execCommand } from '../shared'

/**
 * 列出远程仓库所有分支（含最新提交时间），并按时间倒序打印
 * - 会先执行 `git fetch --prune --tags` 同步远程引用
 * - 通过 `git for-each-ref` 获取 `refs/remotes/<remote>` 下的分支与提交时间
 * @param remote 远程仓库名，默认 `origin`
 * @returns Promise<void>
 */
export async function gitRemoteBranches(urlOrRemote?: string): Promise<void> {
  const temp = 'gb-temp'
  const target = (urlOrRemote || '').trim()
  let refBase = ''

  try {
    if (target) {
      // 通过 URL 拉取远程 heads 到临时命名空间，不污染远程配置
      await execCommand('git', [
        'fetch',
        target,
        `+refs/heads/*:refs/remotes/${temp}/*`,
        '--prune',
        '--no-tags'
      ])
      refBase = `refs/remotes/${temp}`
    }
    else {
      const r = 'origin'
      await execCommand('git', ['fetch', r, '--prune', '--tags'])
      refBase = `refs/remotes/${r}`
    }
  }
  catch {
    console.log('拉取远程分支失败，请检查 URL 或网络连接')
    return
  }

  // 获取远程分支及其最新提交时间（ISO8601），按提交时间倒序
  const out = await execCommand(
    'git',
    [
      'for-each-ref',
      '--format=%(refname:short)\t%(committerdate:relative)\t%(objectname:short)\t%(contents:subject)',
      '--sort=-committerdate',
      refBase
    ]
  )

  const lines = out.split('\n').filter(Boolean)
  if (lines.length === 0) {
    console.log('未找到远程分支，请确认已配置远程并有追踪分支')
    return
  }

  /**
   * 英文相对时间转中文
   * @param rel 英文相对时间字符串（如：2 hours ago）
   * @returns 中文相对时间（如：2小时前）
   */
  function zhRelative(rel: string): string {
    const s = rel.toLowerCase().trim()
    let m: RegExpMatchArray | null
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+seconds?\s+ago$/)))
      return `${m[1]}秒前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+minutes?\s+ago$/)))
      return `${m[1]}分钟前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+hours?\s+ago$/)))
      return `${m[1]}小时前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+days?\s+ago$/)))
      return `${m[1]}天前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+weeks?\s+ago$/)))
      return `${m[1]}周前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+months?\s+ago$/)))
      return `${m[1]}个月前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^(\d+)\s+years?\s+ago$/)))
      return `${m[1]}年前`
    if (s === 'yesterday')
      return '昨天'
    if (s === 'today')
      return '今天'
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^about\s+(\d+)\s+hours?\s+ago$/)))
      return `${m[1]}小时前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^about\s+(\d+)\s+minutes?\s+ago$/)))
      return `${m[1]}分钟前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^about\s+(\d+)\s+days?\s+ago$/)))
      return `${m[1]}天前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^about\s+(\d+)\s+months?\s+ago$/)))
      return `${m[1]}个月前`
    // eslint-disable-next-line no-cond-assign
    if ((m = s.match(/^about\s+(\d+)\s+years?\s+ago$/)))
      return `${m[1]}年前`
    return rel
  }

  /**
   * 计算字符串在等宽终端中的显示宽度（简单处理全角字符为宽度 2）
   * @param s 输入字符串（不含 ANSI 颜色码）
   * @returns 可视宽度
   */
  function displayWidth(s: string): number {
    let w = 0
    for (const ch of s) {
      const code = ch.codePointAt(0) || 0
      const isFull = (
        (code >= 0x1100 && code <= 0x115F)
        || (code >= 0x2E80 && code <= 0xA4CF)
        || (code >= 0xAC00 && code <= 0xD7A3)
        || (code >= 0xF900 && code <= 0xFAFF)
        || (code >= 0xFE10 && code <= 0xFE19)
        || (code >= 0xFE30 && code <= 0xFE6F)
        || (code >= 0xFF00 && code <= 0xFF60)
        || (code >= 0xFFE0 && code <= 0xFFE6)
      )
      w += isFull ? 2 : 1
    }
    return w
  }

  /**
   * 基于显示宽度的左对齐填充
   * @param s 源字符串
   * @param width 目标显示宽度
   * @returns 左对齐并填充空格的字符串
   */
  function padEndDisplay(s: string, width: number): string {
    const w = displayWidth(s)
    if (w >= width)
      return s
    return s + ' '.repeat(width - w)
  }

  const rows = lines
    .map((line) => {
      const [nameRaw, relRaw, shaRaw, subjectRaw] = line.split('\t')
      const name = nameRaw.replace(/^.+\//, '')
      const rel = relRaw || ''
      const relZh = zhRelative(rel)
      const sha = (shaRaw || '').slice(0, 7)
      const subject = subjectRaw || ''
      return { name, relZh, sha, subject }
    })
    .filter(item => item.name && item.name !== 'HEAD')
    // 保持 for-each-ref 的倒序结果，不再二次排序

  const nameWidth = Math.max(...rows.map(r => displayWidth(r.name)))
  const relValues = rows.map(r => `(${r.relZh})`)
  const relWidth = Math.max(...relValues.map(v => displayWidth(v)), 0)

  const label = ' 最新 '
  const labelWidth = displayWidth(label)
  const tag = bgGreen(white(label))
  const pad = ' '.repeat(labelWidth)
  rows.forEach((row, i) => {
    const relText = padEndDisplay(`(${row.relZh})`, relWidth)
    const nameCol = padEndDisplay(row.name, nameWidth)
    const line = `${nameCol}  ${relText}  ${row.sha} ${row.subject}`
    if (i === 0) {
      console.log(`${tag} ${lightGreen(line)}`)
    }
    else {
      console.log(`${pad} ${white(line)}`)
    }
  })

  // 清理临时引用
  if (target) {
    const refnames = await execCommand('git', [
      'for-each-ref',
      '--format=%(refname)',
      refBase
    ])
    for (const ref of refnames.split('\n').filter(Boolean)) {
      await execCommand('git', ['update-ref', '-d', ref])
    }
  }
}
