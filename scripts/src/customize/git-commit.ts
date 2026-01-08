import enquirer from 'enquirer'
import { yellow } from 'kolorist'
import { execCommand } from '../shared'

/**
 * 解析分支名获取版本号
 *
 * 从分支名中提取版本号部分并添加 'v' 前缀。例如将 'dev-1.2.3.4-patch' 转换为 'v1.2.3.4-patch'。
 * 这样符合 Conventional Commits 的 scope 规范，同时也满足特定的版本管理需求。
 *
 * @param branch - Git 分支名称
 * @returns 格式化后的版本号字符串，如果不匹配 'dev-' 前缀则返回原分支名
 *
 * @example
 * ```ts
 * parseBranchToVersion('dev-1.2.3.4-patch') // 返回 'v1.2.3.4-patch'
 * parseBranchToVersion('feat-login') // 返回 'feat-login'
 * ```
 */
function parseBranchToVersion(branch: string): string {
  if (!branch)
    return ''
  // 从第一个数字开始提取到结尾作为版本号部分
  const reg = /(\d.*)$/
  const match = branch.match(reg)
  if (match && match[0]) {
    return `v${match[0]}`
  }
  return branch
}

/**
 * 获取当前 Git 分支名称
 *
 * 使用 git symbolic-ref 获取当前分支的短名称
 *
 * @returns {Promise<string>} 分支名称，获取失败返回空字符串
 */
async function getBranchName(): Promise<string> {
  try {
    const branch = await execCommand('git', ['symbolic-ref', '--short', 'HEAD'])
    return branch.trim()
  }
  catch {
    return ''
  }
}

const config = {
  gitCommitMessages: {
    types: '请选择提交类型',
    scopes: '请输入当前分支信息或者按下 [Tab] 键自动填充',
    description: `请输入描述信息（${yellow('!')}开头表示破坏性改动`
  },
  gitCommitTypes: [
    ['feat', '新功能'],
    ['feat-wip', '开发中的功能，比如某功能的部分代码'],
    ['fix', '修复Bug'],
    ['docs', '只涉及文档更新'],
    ['typo', '代码或文档勘误，比如错误拼写'],
    ['style', '修改代码风格，不影响代码含义的变更'],
    ['refactor', '代码重构，既不修复 bug 也不添加功能的代码变更'],
    ['perf', '可提高性能的代码更改'],
    ['optimize', '优化代码质量的代码更改'],
    ['test', '添加缺失的测试或更正现有测试'],
    ['build', '影响构建系统或外部依赖项的更改'],
    ['ci', '对 CI 配置文件和脚本的更改'],
    ['chore', '没有修改src或测试文件的其他变更'],
    ['revert', '还原先前的提交']
  ] as [string, string][]
}

/**
 * 交互式生成符合 Conventional Commits 的提交信息并执行提交 (天泽智联定制版)
 * - 提交范围 (scope) 默认为当前 Git 分支名称
 * - 支持取消或非交互环境下安全退出
 * @param {Lang} lang 交互提示语言
 * @returns {Promise<void>} 异步任务
 */
export async function gitCommitTz(): Promise<void> {
  try {
    const { prompt: ask } = enquirer
    const { gitCommitMessages, gitCommitTypes } = config

    const branchName = await getBranchName()
    const initialScope = parseBranchToVersion(branchName)

    const typesChoices = gitCommitTypes.map(([value, msg]) => {
      const nameWithSuffix = `${value}:`
      const message = `${nameWithSuffix.padEnd(12)}${msg}`
      return { name: value, message }
    })

    const result = await ask<{ types: string, scopes: string, description: string }>([
      { name: 'types', type: 'select', message: gitCommitMessages.types, choices: typesChoices },
      {
        name: 'scopes',
        type: 'input',
        message: gitCommitMessages.scopes,
        initial: initialScope,
        validate(value) {
          if (!value.trim())
            return '分支信息 (scope) 不能为空'
          return true
        }
      },
      {
        name: 'description',
        type: 'input',
        message: gitCommitMessages.description,
        initial: '输入本次提交的描述信息',
        validate(value) {
          if (!value.trim() || value === '输入本次提交的描述信息')
            return '提交描述不能为空'
          if (value.length < 2)
            return '提交描述长度不能少于 2 个字符'
          return true
        }
      }
    ])

    if (!result)
      return

    const breaking = result.description.startsWith('!') ? '!' : ''
    const description = result.description.replace(/^!/, '').trim()
    const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`

    await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' })
  }
  catch {

  }
}
