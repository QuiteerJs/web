# Hooks 便捷函数

`@quiteer/naive-extra` 提供一组面向业务的便捷 Hooks，用于表单、布局、表格、上传、主题配置等场景的快速接入。

## 总览

- `useForm`：动态更新表单 `schemas` 的工具集合
- `useLayout` / `useActiveKey`：布局状态与菜单激活控制
- `useProviderContext`：读取/更新全局主题配置
- `useTable`：操作 `QuiTable` 实例与列构造器
- `useThemeOverrides`：获取 Naive UI 组件主题覆盖
- `useUploadProps`：快速生成上传组件属性

## useForm

对 `FormSchema[]` 进行原地更新，适合接口驱动的表单配置。所有方法都是对原数组的就地变更，保持响应式。

### 适用场景

- 后端返回动态表单字段，需要在运行时更新选项或组件属性
- 表单字段需要按条件插入、删除、替换
- 需要在外部触发 `validate`、`resetFields` 等表单方法

### 参数

- `schemas`: `FormSchema[]`
- `formRef`（可选）: `Ref<any>`，用于绑定表单实例

### 常用方法

- `setOptions(field, options)`：更新 `NSelect` / `NRadioGroup` / `NCheckbox` 选项
- `setComponentProps(field, props)`：合并组件属性
- `setDefaultValue(field, value)`：设置默认值
- `replaceSchema(field, patch)`：局部替换字段定义
- `upsertSchema(schema)`：不存在则新增、存在则合并
- `removeSchema(field)`：移除字段
- `validate / resetFields / clearValidate / getFieldsValue / setFieldsValue`

### 示例：动态更新选项与组件属性

```ts
import { useForm } from '@quiteer/naive-extra'

const { setOptions, setComponentProps, upsertSchema } = useForm(schemas)

setOptions('status', [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 }
])

setComponentProps('status', { clearable: true })
upsertSchema({ field: 'remark', label: '备注', component: 'NInput' })
```

### 示例：配合表单实例方法

```ts
const { validate, resetFields, getFieldsValue } = useForm(schemas, formRef)

await validate()
const values = getFieldsValue()
resetFields()
```

## useLayout

用于布局状态管理与菜单联动，常搭配 `QuiLayout` 使用。内部会基于路由表生成菜单树，并同步 `activeKey`。

### 参数

- `baseRoutes`: `RouteRecordRaw[] | Ref<RouteRecordRaw[]>`
- `menuOptions`（可选）: `MenuOption[] | Ref<MenuOption[]>`
- `router`（可选）: `Router`，显式传入可避免 Store 场景下的路由上下文丢失
- `route`（可选）: `RouteLocationNormalizedLoaded`
- `type / initialActiveKey / headerHeight / siderWidth` 等布局配置项

### 返回值核心字段

- `collapsed / setCollapsed / toggle`
- `activeKey / setActiveKey`
- `menuOptions`
- `addRoute / addRoutes / removeRoute`
- `type`、`bordered`、`inverted` 等布局状态

### 示例：基础使用

```ts
import { useLayout } from '@quiteer/naive-extra'
import { routes } from '@/router'

const {
  collapsed,
  activeKey,
  menuOptions,
  toggle,
  addRoute
} = useLayout({
  baseRoutes: routes,
  initialActiveKey: '/',
  type: 'side-menu'
})
```

### 示例：Store 中显式传入 router

```ts
import router, { routes } from '@/router'

const layout = useLayout({
  baseRoutes: routes,
  router,
  initialActiveKey: '/'
})
```

### useActiveKey

独立的激活状态管理（`useLayout` 内部也会使用）。

```ts
import { useActiveKey } from '@quiteer/naive-extra'

const { activeKey, setActiveKey } = useActiveKey('/')
```

## useProviderContext

读取 `QuiProvider` 提供的主题上下文，并更新全局配置。若未包裹 `QuiProvider`，会返回兜底配置并输出警告。

### 返回值

- `config`：原始配置
- `mergedConfig`：合并后的可直接用于 `ConfigProvider` 的配置
- `updateConfig`：局部更新配置
- `toggleTheme / toggleLocale / setPrimaryColor` 等便捷方法

### 示例：更新主题色

```ts
import { useProviderContext } from '@quiteer/naive-extra'

const { mergedConfig, updateConfig } = useProviderContext()
updateConfig({ palette: { primary: '#5b8cff' } })
```

## useTable

针对 `QuiTable` 的操作集合与常用列构造器。通过 `tableRef` 调用 `defineExpose` 的内部方法。

### 常用能力

- `refresh`：刷新数据（支持重置页码）
- `downloadCsv`：导出 CSV
- `setActions / setColumns / getColumns`
- `setPagination / getPagination`
- `setData / getData / setFetch / withSearch`
- `createImageColumn / createIndexColumn / createTextColumn / createMoneyColumn`

### 示例：操作表格与列构造

```ts
import { useTable } from '@quiteer/naive-extra'

const { tableRef, refresh, createIndexColumn, createMoneyColumn } = useTable()

const columns = [
  createIndexColumn(),
  { title: '姓名', key: 'name' },
  createMoneyColumn('amount', '金额', 2)
]
```

### 示例：绑定搜索条件

```ts
const { withSearch } = useTable()

withSearch(
  () => ({ status: searchState.status }),
  async (params) => {
    return api.fetchList(params)
  }
)
```

## useThemeOverrides

获取 Naive UI 单个组件的主题覆盖配置，重点是提供完整类型提示，便于在业务代码中安全读取/修改。

### 示例

```ts
import { useThemeOverrides } from '@quiteer/naive-extra'

const buttonOverrides = useThemeOverrides('Button')
buttonOverrides.value.peers = {
  Ripple: { color: '#5b8cff' }
}
```

## useUploadProps

快速生成上传配置，内置图片/视频/音频的 `accept` 预设。

### 返回方法

- `getUploadProps`
- `getImageUploadProps`
- `getVedioUploadProps`
- `getAudioUploadProps`

### 示例：图片上传

```ts
import { useUploadProps, AcceptType } from '@quiteer/naive-extra'

const { getImageUploadProps } = useUploadProps({ max: 5 })
const props = getImageUploadProps({ accept: AcceptType.Image })
```

### 示例：统一基础配置

```ts
const { getUploadProps } = useUploadProps({
  action: '/upload',
  max: 3,
  multiple: true
})

const props = getUploadProps()
```
