
# @quiteer/scripts

一个辅助 Monorepo 开发与发布的 CLI 工具集，内置以下能力：

- 清理目录：批量清除 `dist`、`node_modules` 等产物
- 依赖升级：调用 `npm-check-updates` 统一升级依赖
- 规范化提交：遵循 Conventional Commits 的交互式提交与校验
- 发布流程：版本号递增、生成变更日志、提交与推送
- 生成配置：在项目根目录生成 `quiteer.config.ts`

## 安装与运行

- 工作区使用（推荐）：
  - 在仓库根目录通过可执行文件运行：
    - `pnpm --filter @quiteer/scripts exec quiteer <command>`
    - 或使用别名：`pnpm --filter @quiteer/scripts exec qui <command>`
- 全局使用（发布后）：
  - `pnpm dlx @quiteer/scripts <command>` 或全局安装后直接执行 `quiteer <command>`

可执行文件名为 `quiteer` 与 `qui`。开发态指向 `src/bin.js`，发布态通过 `publishConfig.bin` 指向编译产物 `dist/index.mjs`。

## 命令总览

### generate-config / g

在项目根目录生成 `quiteer.config.ts`。若已存在会询问是否覆盖。

示例：

- `pnpm --filter @quiteer/scripts exec quiteer generate-config`

### cleanup / c

清除目录产物。支持传入单个或多个路径（逗号分隔）。未传入时按配置文件或默认值执行。

示例：

- 使用默认配置：`pnpm --filter @quiteer/scripts exec quiteer cleanup`
- 指定路径：`pnpm --filter @quiteer/scripts exec quiteer cleanup "packages/*/dist,packages/*/node_modules"`

### update-pkg / u

基于 `npm-check-updates` 升级依赖版本。

示例：

- `pnpm --filter @quiteer/scripts exec quiteer update-pkg`

### git-commit / git-c

交互式生成符合 Conventional Commits 的提交信息；支持在提交前添加变更文件。

选项：

- `--add` 是否在提交前添加变更（默认开启）。当选择不添加全部文件时，提供多选列表空格选择、回车确认。
- `--lang` 提示语言（默认读取配置，支持 `zh-cn`/`en-us` 等）。

示例：

- `pnpm --filter @quiteer/scripts exec quiteer git-commit --add`

### git-commit-verify / git-v

校验最近一次提交信息是否符合 Conventional Commits 格式。

示例：

- `pnpm --filter @quiteer/scripts exec quiteer git-commit-verify`

### release / r

发布流程：批量提升版本、打标签、提交与推送。

选项：

- `--execute` 在版本提升后、提交前执行额外命令（如 `pnpm -w build`）
- `--push` 是否推送提交与标签（默认开启）

示例：

- `pnpm --filter @quiteer/scripts exec quiteer release --execute "pnpm -w build" --push`

## 配置文件

生成的 `quiteer.config.ts` 示例：

```ts
export default {
  cleanupDirs: ["**/dist", "**/node_modules", "!node_modules/**"],
  lang: 'zh-cn',
  ncuCommandArgs: ['--deep', '-u'],
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*)|(Merge branch (.*)))(?:\r?\n)*$/m,
    /^(Merge tag (.*))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/, 
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ]
}
```

## 注意事项

- 需要 `pnpm` 环境与 Node `>=22.12.0`（项目当前为 `22.14.0`）
- 发布时若遇到 `ERR_PNPM_GIT_UNCLEAN`，请提交/暂存变更或使用 `--no-git-checks`
- 工作区开发时建议先执行 `pnpm --filter @quiteer/scripts build` 生成 `dist`
