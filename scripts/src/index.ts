import type { Lang } from './locales'
import cac from 'cac'
import { blue, gray, lightGreen } from 'kolorist'
import { version } from '../package.json'
import { cleanup, gitCommit, gitCommitAdd, gitCommitVerify, release, updatePkg } from './commands'
import { loadCliOptions } from './config'

type Command = 'remove' | 'cleanup' | 'update-pkg' | 'git-add' | 'git-commit' | 'git-commit-verify' | 'release'

type CommandAction<A extends object> = (args?: A) => Promise<void> | void

type CommandWithAction<A extends object = object> = Record<Exclude<Command, 'remove'>, { desc: string, action: CommandAction<A> }>

interface CommandArg {
  remove?: string
  /** Execute additional command after bumping and before git commit. Defaults to 'pnpm sa changelog' */
  execute?: string
  /** Indicates whether to push the git commit and tag. Defaults to true */
  push?: boolean
  /** Generate changelog by total tags */
  total?: boolean
  /**
   * The glob pattern of dirs to clean up
   *
   * If not set, it will use the default value
   *
   * Multiple values use "," to separate them
   */
  cleanupDir?: string
  /**
   * display lang of cli
   *
   * @default 'en-us'
   */
  lang?: Lang
}

export async function setupCli() {
  /**
   * 初始化并注册 CLI
   * - 加载配置，注册命令与选项
   * - 设置中文提示与帮助文案
   * @returns Promise<void>
   */
  const cliOptions = await loadCliOptions()

  const cli = cac(blue('quiteer-scripts'))

  cli
    .version(lightGreen(version))
    .option('-p, --push', '是否推送提交与标签')
    .option('-t, --total', '根据所有标签生成变更日志')
    .option(
      '-c, --cleanupDir <dir>',
      '需要清理的目录的 glob 通配符；未设置将使用默认值；多个值用逗号分隔'
    )
    .option('-l, --lang <lang>', 'CLI 显示语言', { default: 'zh-en', type: [String] })
    .help()

  cli.command('remove [path]', '删除单个或者多个文件，多个值用逗号分隔，递归删除')
    .alias('rm')
    .action(async (args) => {
      if (args && args.includes(',')) {
        await cleanup(args.split(','))
      }
      else if (args) {
        await cleanup([args])
      }
      else {
        console.info('quiteer-script :>> ', gray('无事发生'))
      }
    }
    )

  const commands: CommandWithAction<CommandArg> = {
    'cleanup': {
      desc: '删除目录 node_modules、dist 等',
      action: async (args) => {
        if (args?.cleanupDir && args?.cleanupDir.includes(',')) {
          const path = args?.cleanupDir.split(',')
          await cleanup(path)
        }
        else if (args?.cleanupDir) {
          await cleanup([args?.cleanupDir])
        }
        else {
          await cleanup(cliOptions.cleanupDirs)
        }
      }
    },
    'update-pkg': {
      desc: '更新 package.json 依赖版本',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs)
      }
    },
    'git-add': {
      desc: '添加所有变更文件到暂存区',
      action: async () => {
        await gitCommitAdd()
      }
    },
    'git-commit': {
      desc: '生成并提交符合 Conventional Commits 的信息',
      action: async (args) => {
        await gitCommit(args?.lang)
      }
    },
    'git-commit-verify': {
      desc: '校验提交信息是否符合 Conventional Commits 标准',
      action: async (args) => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores)
      }
    },
    'release': {
      desc: '发布：更新版本、生成变更日志、提交代码',
      action: async (args) => {
        await release(args?.execute, args?.push)
      }
    }
  }

  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action)
  }

  cli.parse()
}

setupCli()
