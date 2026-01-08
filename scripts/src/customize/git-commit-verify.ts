import type { Lang } from '../types'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { locales } from '../locales'
import { execCommand } from '../shared'

/** Git commit message verify */
export async function gitCommitVerifyTz(lang: Lang = 'zh-cn', ignores: RegExp[] = []) {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel'])

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG')

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim()

  if (ignores.some(regExp => regExp.test(commitMsg)))
    return

  const REG_EXP = /^(?<type>[a-z-]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)$/i
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const VERSION_REG_EXP = /^v\d+\.\d+\.\d+\.\d+(-[a-z0-9]+)?$/

  const match = commitMsg.match(REG_EXP)

  if (!match) {
    const errorMsg = locales[lang].gitCommitVerify
    throw new Error(errorMsg)
  }

  const { type, scope } = match.groups || {}

  // 针对 fix 类型，强制校验 scope 是否为合规的版本号格式 (如 v1.2.3.4 或 v1.2.3.4-patch)
  if (type === 'fix') {
    if (!scope || !VERSION_REG_EXP.test(scope)) {
      const errorMsg = lang === 'zh-cn'
        ? `[校验失败]: 当提交类型为 'fix' 时，scope 必须是符合规范的版本号 (例如: v1.2.3.4 或 v1.2.3.4-patch)`
        : `[Verify Failed]: When commit type is 'fix', scope must be a valid version (e.g., v1.2.3.4 or v1.2.3.4-patch)`
      throw new Error(errorMsg)
    }
  }
}
