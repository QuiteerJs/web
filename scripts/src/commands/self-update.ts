import { execa } from 'execa'
import { bgGreen, lightBlue, lightCyan, lightGreen, white } from 'kolorist'
import { version } from '../../package.json'
import { execCommand } from '../shared'

/**
 * 获取当前命令来源路径（本地 node_modules/.bin 或全局）
 * @returns 可执行文件路径（若无法获取返回空字符串）
 */
async function getCurrentBinPath(): Promise<string> {
  try {
    const p = await execCommand('command', ['-v', 'qui'])
    if (p)
      return p
  }
  catch {}
  try {
    const p = await execCommand('which', ['qui'])
    return p
  }
  catch {
    return ''
  }
}

/**
 * 检查 @quiteer/scripts 是否有新版本并提示更新
 * - 启动任意命令时调用，仅提示不执行安装
 */
export async function checkUpdateAndNotify(): Promise<void> {
  try {
    const latest = await execCommand('pnpm', ['view', '@quiteer/scripts', 'version'])
    const binPath = await getCurrentBinPath()
    const isLocal = binPath.includes('node_modules/.bin')
    if (latest && latest !== version) {
      console.info(
        'quiteer-script :>> ',
        lightCyan(
          `检测到新版本 ${lightGreen(latest)}，当前版本 ${lightBlue(version)}，建议执行 ${bgGreen(white('qui su'))} 进行更新`
        )
      )
      if (isLocal) {
        console.info(
          'quiteer-script :>> ',
          lightBlue(`当前正在使用本地工作区命令：${binPath}`)
        )
      }
    }
  }
  catch {
    // 忽略网络或环境错误，不影响命令执行
  }
}

/**
 * 自更新到最新版本
 * - 对比当前版本与远端版本，不一致则使用 pnpm 全局更新
 */
export async function selfUpdate(): Promise<void> {
  const latest = await execCommand('pnpm', ['view', '@quiteer/scripts', 'version'])
  if (!latest) {
    console.info('quiteer-script :>> ', lightBlue('无法获取远端版本，请检查网络后重试'))
    return
  }

  if (latest === version) {
    console.info('quiteer-script :>> ', lightGreen(`已是最新版本 ${latest}`))
    return
  }

  console.info('quiteer-script :>> ', lightCyan(`开始更新到最新版本 ${latest}（当前 ${version}）`))
  try {
    await execa('pnpm', ['add', '-g', `@quiteer/scripts@${latest}`], { stdio: 'inherit' })
    console.info('quiteer-script :>> ', lightGreen('更新完成，请重新运行命令'))
    const binPath = await getCurrentBinPath()
    const isLocal = binPath.includes('node_modules/.bin')
    if (isLocal) {
      console.info('quiteer-script :>> ', lightBlue('当前命令来源于本地工作区，如需使用全局最新版本：'))
      console.info('quiteer-script :>> ', lightBlue('1) 退出当前仓库目录后执行 `qui`'))
      console.info('quiteer-script :>> ', lightBlue('2) 或使用临时执行：`pnpm dlx @quiteer/scripts <command>`'))
    }
  }
  catch (e) {
    console.info('quiteer-script :>> ', lightBlue(`更新失败：${(e as Error)?.message || '未知错误'}`))
  }
}
