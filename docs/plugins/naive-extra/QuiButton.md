# QuiButton 按钮组件

包含 `QuiBaseButton`（基础按钮）和 `QuiActionButton`（操作按钮组）两个组件，分别解决单按钮交互增强与表格操作列聚合的场景。

## QuiBaseButton

对 `NButton` 的增强封装，内置 Tooltip（提示）与 Popconfirm（二次确认）能力，并提供权限控制逻辑。

### 能力概览

- 支持 `icon`、`tooltip`、`popconfirm` 与 `popText` 等快速配置
- 二次确认与提示自动包裹，减少模板样板
- 内置权限判定：隐藏或禁用按钮
- 继承 `Naive UI` 全量 `ButtonProps`，保持原生一致性

### 基础用法

```vue
<script setup lang="ts">
import { QuiBaseButton } from '@quiteer/naive-extra'

/**
 * 删除确认回调
 *
 * 删除当前数据并刷新列表，具体实现由业务侧补充。
 *
 * @param event - 点击事件对象
 * @returns void
 * @throws {Error} 当删除过程发生异常时抛出
 *
 * @example
 * ```ts
 * handleDelete(new MouseEvent('click'))
 * ```
 *
 * @remarks
 * - 建议在内部处理异常与提示
 * - 可搭配列表刷新逻辑
 *
 * @security
 * 删除接口需做权限校验与防重复提交
 *
 * @performance
 * O(1) 事件处理，不引入额外开销
 */
function handleDelete(event: MouseEvent) {
  console.log(event)
}
</script>

<template>
  <QuiBaseButton type="primary">保存</QuiBaseButton>

  <QuiBaseButton icon="carbon:add">新建</QuiBaseButton>

  <QuiBaseButton icon="carbon:help" tooltip="点击查看帮助" />

  <QuiBaseButton
    type="error"
    pop-text="确认删除该数据吗？"
    @positive-click="handleDelete"
  >
    删除
  </QuiBaseButton>
</template>
```

### 权限控制

权限判定只依赖 `permission.group` 与 `permission.disabled`，逻辑如下：

- `group` 不完整（`codes` 或 `code` 缺失）时默认放行
- 有权限：按钮显示且不禁用
- 无权限且 `disabled=true`：按钮显示但禁用
- 无权限且 `disabled=false`：按钮隐藏

> `permission.show` 当前不会参与渲染判断，可视为保留字段。

### Popconfirm 行为说明

- 只要 `popconfirm`、`popText`、`positiveText` 或 `negativeText` 任意传入，即启用二次确认
- `popText` 会作为默认提示内容，未设置时提示为 `确认进行此操作？`
- `positiveText` 与 `negativeText` 仅覆盖确认/取消按钮文本
- `popconfirm` 传对象时会透传给 `NPopconfirm`（`onPositiveClick` 事件由组件内部统一处理）

### 默认配置

`QuiBaseButton` 默认值（来自组件 `withDefaults` 与内部逻辑）：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| type | `'default'` | 透传 NButton 的类型 |
| size | `'small'` | 透传 NButton 的尺寸 |
| text | `false` | 是否文本按钮 |
| secondary | `false` | 是否次级按钮 |
| disabled | `undefined` | 未传时由权限判定结果控制 |
| popconfirmTitle | `'确认进行此操作？'` | 未传 `popText` 时的确认文案 |
| permission | `undefined` | 未传时默认可见且不禁用 |

### API

#### Props

继承自 Naive UI `ButtonProps`，并扩展以下属性：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标名称 (Iconify) | `string` | - |
| tooltip | 提示文本，存在时自动包裹 NTooltip | `string` | - |
| text | 是否为文本按钮 | `boolean` | `false` |
| popconfirm | Popconfirm 配置对象，存在时自动包裹 NPopconfirm | `PopconfirmProps` | - |
| popText | Popconfirm 确认文本，设置后自动开启 Popconfirm | `string` | - |
| positiveText | Popconfirm 确认按钮文本 | `string` | - |
| negativeText | Popconfirm 取消按钮文本 | `string` | - |
| permission | 权限控制配置 | `ButtonPermission` | - |

#### ButtonPermission 类型

```typescript
interface ButtonPermission {
  /** 权限组：[拥有的权限列表, 需要的权限] */
  group: [string[], string]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示 */
  show?: boolean
}
```

#### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标 |
| tooltip | 自定义 Tooltip 内容 |
| popconfirm | 自定义 Popconfirm 内容 |

#### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击事件 | `(e: MouseEvent) => void` |
| positiveClick | Popconfirm 确认点击事件 | `(e: MouseEvent) => void` |

---

## QuiActionButton

专为表格操作列设计的按钮组组件，支持自动折叠、响应式布局与统一配置，适合列表场景的高频操作入口。

### 能力概览

- 根据 `mode` 自动切换 icon/文本/按钮样式
- 支持 `show` 与 `disabled` 逻辑表达式或 `Ref`
- 统一 `buttonProps` 与单项 `props` 合并
- 支持响应式折叠与“更多”下拉聚合

### 基础用法

```vue
<script setup lang="ts">
import type { ActionItem } from '@quiteer/naive-extra'
import { QuiActionButton } from '@quiteer/naive-extra'

/**
 * 通用操作处理
 *
 * 根据 key 执行业务动作（如编辑或查看详情）。
 *
 * @param key - 操作标识
 * @param item - 当前操作项
 * @returns void
 * @throws {Error} 当业务操作失败时抛出
 *
 * @example
 * ```ts
 * handleAction('edit', { key: 'edit', label: '编辑' } as ActionItem)
 * ```
 *
 * @remarks
 * - 建议在内部处理异常与用户提示
 * - 可配合路由跳转或弹窗表单
 *
 * @security
 * 操作需结合权限与后端校验
 *
 * @performance
 * O(1) 事件处理，不引入额外开销
 */
function handleAction(key: string, item: ActionItem) {
  console.log(key, item)
}

const actions: ActionItem[] = [
  { key: 'edit', label: '编辑', onClick: handleAction },
  { key: 'delete', label: '删除', popText: '确认删除？', onPositiveClick: handleAction }
]
</script>

<template>
  <QuiActionButton :actions="actions" />
</template>
```

### 响应式折叠

```vue
<template>
  <QuiActionButton
    :actions="actions"
    mode="icon-text"
    :responsive="true"
    :show-divider="true"
  />
</template>
```

### 行为说明

- `mode="icon"` 时仅显示图标，默认将 `tooltip` 设为 `label`
- `mode="icon-text"` 时图标 + 文字同时展示
- `mode="button"` 为实体按钮，`mode="secondary"` 为次要按钮样式
- `buttonProps` 会与 `ActionItem.props` 合并，`ActionItem.props` 优先生效
- `disabled`/`show` 支持 `boolean | () => boolean | Ref<boolean>`
- `responsive=true` 时 `max` 失效，组件会根据容器宽度自动计算折叠数量
- “更多”按钮会继承 `buttonProps`，并根据 `mode` 自动调整展示样式

> 当操作项配置了 `popconfirm` 且被折叠到“更多”菜单时，当前实现不会触发二次确认。建议为此类操作预留 `max` 或关闭 `responsive`。

### 默认配置

`QuiActionButton` 默认值（来自组件 `withDefaults` 与内置映射）：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| actions | `[]` | 默认无操作项 |
| mode | `'button'` | 默认实体按钮样式 |
| max | `3` | 超出数量折叠为“更多” |
| buttonProps | `undefined` | 不强制覆盖按钮属性 |
| size | `undefined` | 不强制覆盖按钮尺寸 |
| showDivider | `false` | 默认不显示分割线 |
| responsive | `false` | 未开启响应式折叠 |
| 默认图标 | `ActionEnum` 对应图标 | 内置映射，未命中时回退 `carbon:unknown` |
| “更多”图标 | `carbon:overflow-menu-horizontal` | 用于折叠按钮 |

### API

#### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actions | 按钮配置列表 | `ActionItem[]` | `[]` |
| mode | 显示模式 | `'icon' \| 'text' \| 'icon-text' \| 'button' \| 'secondary'` | `'button'` |
| max | 最大显示数量，超过的折叠到“更多”菜单 | `number` | `3` |
| showDivider | 是否显示分割线 (仅 text 模式有效) | `boolean` | `false` |
| responsive | 是否开启响应式折叠 (自动根据宽度计算 max) | `boolean` | `false` |
| size | 按钮尺寸 | `ButtonProps['size']` | - |
| buttonProps | 统一透传给所有按钮的属性 | `ButtonProps` | - |

#### ActionItem 配置

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| key | 唯一标识，也是默认图标映射键值 | `string` |
| label | 按钮文本 | `string` |
| icon | 图标名称 | `string` |
| onClick | 点击回调 | `(key, item) => void` |
| show | 是否显示 | `boolean \| (() => boolean) \| Ref<boolean>` |
| disabled | 是否禁用 | `boolean \| (() => boolean) \| Ref<boolean>` |
| tooltip | 提示文本 | `string` |
| popconfirm | Popconfirm 配置 | `PopconfirmProps` |
| popText | Popconfirm 文本 | `string` |
| positiveText | Popconfirm 确认按钮文本 | `string` |
| negativeText | Popconfirm 取消按钮文本 | `string` |
| onPositiveClick | Popconfirm 确认回调 | `(key, item) => void` |
| permission | 权限控制 | `ButtonPermission` |
| props | 透传给单个按钮的属性 | `ButtonProps` |

### 内置 ActionEnum

组件内部内置常用操作枚举与默认图标映射，可直接通过 `key` 使用：

```typescript
enum ActionEnum {
  EDIT = 'edit',      // carbon:edit
  DELETE = 'delete',  // carbon:trash-can
  VIEW = 'view',      // carbon:view
  ADD = 'add',        // carbon:add
  SEARCH = 'search',  // carbon:search
  DOWNLOAD = 'download', // carbon:download
  UPLOAD = 'upload',  // carbon:upload
  SETTING = 'setting' // carbon:settings
}
```
