
# @quiteer/scripts

一个辅助开发与发布的 CLI 工具集，内置以下能力：

- 清理目录：批量清除 `dist`、`node_modules` 等产物
- 依赖升级：调用 `npm-check-updates` 统一升级依赖
- 规范化提交：遵循 Conventional Commits 的交互式提交与校验
- 版本管理：交互选择包、提升版本、创建自定义前缀标签、生成全量 changelog
- 生成配置：在项目根目录生成 `quiteer.config.ts`

## 安装与运行

- 全局安装（推荐）：
  - `pnpm i -g @quiteer/scripts` 或 `npm i -g @quiteer/scripts`
  - 直接执行 `qui <command>` 或 `quiteer <command>`


> 运行环境：Node.js ≥ 22.14.0，包管理器建议使用 pnpm。

## 命令总览与示例

### generate-config / g

在项目根目录生成 `quiteer.config.ts`。若已存在会询问是否覆盖。

- 示例：`qui g`

### cleanup / c

清除目录产物。支持传入单个或多个路径（逗号分隔）。未传入时按配置或默认值执行。

- 使用默认配置：`qui c`
- 指定路径：`qui c "packages/*/dist,packages/*/node_modules"`

### update-pkg / u

基于 `npm-check-updates` 升级依赖版本。

- 示例：`qui u`

### git-commit / gc

交互式生成符合 Conventional Commits 的提交信息；支持在提交前添加变更文件。

- 选项：
  - `--add` 是否在提交前添加变更（默认开启）。当选择不添加全部文件时，提供多选列表空格选择、回车确认。
  - `-l, --lang` 提示语言（默认读取配置，支持 `zh-cn`/`en-us`）。
- 示例：`qui gc --add`

### git-commit-verify / gv

校验最近一次提交信息是否符合 Conventional Commits 格式。

- 选项：
  - `-l, --lang` 校验提示语言（默认读取配置）。
- 示例：`qui gv`

### release / r

版本管理：交互选择需要更新的包、创建自定义前缀标签并生成全量 changelog。

- 行为：
  - 交互选择要提升版本的包（多选，未选中则跳过，不会改动）
  - 仅更新选中包的 `package.json` 版本并提交（不包含推送）
  - 标签命名为 `<prefix>-vX.Y.Z`（前缀可交互输入或通过选项传入；已存在则跳过创建）
  - 生成 `CHANGELOG.md` 与 `CHANGELOG_TIMELINE.md`，默认范围为仓库“最初提交 → 当前 HEAD”的全量历史
- 选项：
  - `--tag-prefix <prefix>` 标签前缀。示例：`scripts-v0.0.2`
- 示例：
  - `qui r --tag-prefix scripts`

> 发布到 npm 前请确保工作区干净（`git status`），否则 `pnpm publish` 会触发 `ERR_PNPM_GIT_UNCLEAN`。必要时手动提交：`git add -A && git commit -m "docs(changelog): update"`。

## 配置文件示例

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

## 说明与建议

- 多包仓库：发布时可交互选择要更新的包，未选中的包不受影响。
- 标签前缀：用于避免不同包的标签冲突，建议与包名一致，如 `scripts`、`utils`。
- changelog：默认输出全量历史；若希望改为按“上一标签 → 最新标签”的增量方式，可告知作者切换逻辑或提供可选开关。
