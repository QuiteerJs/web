# QuiUpload 组件

## 基本用法

<script setup lang="ts">
import UploadDemo from './components/UploadDemo.vue'
import { AcceptType, useUploadProps ,QuiUpload} from '@quiteer/naive-extra'
import { ref } from 'vue'

const list1 = ref([
  { id: 'a1', name: '示例图片', status: 'finished', url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg' }
])

const list2 = ref([
  { id: 'a1', name: '示例视频', status: 'finished', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
])

const list3 = ref([
  { id: 'a1', name: '示例音频', status: 'finished', url: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3' }
])

</script>

<ClientOnly>
  <UploadDemo />
</ClientOnly>

## 组件模式(fileType)

<ClientOnly>
<n-flex>
  <n-card title="image-view" size="small">
    <QuiUpload file-type="image-view" v-model:value="list1" :is-set-fields-value="true" />
  </n-card>
  <n-card title="video-view" size="small">
    <QuiUpload file-type="video-view" v-model:value="list2" :is-set-fields-value="true" />
  </n-card>
  <n-card title="audio-view" size="small">
    <QuiUpload file-type="audio-view" v-model:value="list3" :is-set-fields-value="true" />
  </n-card>
  <n-card title="file" size="small">
    <QuiUpload file-type="file" v-model:value="list1" :is-set-fields-value="true" />
  </n-card>
</n-flex>
</ClientOnly>

## 属性

- `file-type`：上传视图模式，可选 `image-view` | `video-view` | `audio-view` | `file` | `dragger-file`
- `max`：最大上传数量，`1` 为单文件模式，影响移除行为与展示
- `accept`：允许的文件扩展名列表，结合 `AcceptType` 使用，如 `AcceptType.Image`
- `file-size`：文件大小上限（MB），如 `2` 表示 2MB，上限校验在上传前执行
- `data-type`：返回值类型，设置为 `'string'` 时为单文件 URL 字符串，否则为列表
- `is-set-fields-value`：是否根据 `v-model` 初始值回显文件列表，默认 `true`
- 透传 `naive-ui` 的 `UploadProps`：如 `action`、`headers`、`data`、`disabled`、`list-type` 等

## 事件

- `@finish`：上传完成，组件内部会根据 `data-type` 更新 `v-model`（字符串或列表）
- `@remove`：移除文件，单文件模式会清空，列表模式按下标移除
- `@before-upload`：上传前校验，校验文件类型、大小、文件名合法性
- `@error`：上传错误，打印后端返回的错误信息，便于排查

## 插槽

- `dragger-file` 模式下使用 `NUploadDragger`，可通过默认插槽自定义拖拽区域内容
- 其他模式可以在 `NUpload` 默认插槽中放置触发按钮（示例中使用 `NButton`）

## 返回值结构（v-model）

- 字符串模式：当 `data-type='string'` 且 `max=1`，`v-model:value` 为文件 `url` 字符串
- 列表模式：`v-model:value` 为数组，项结构：`{ id: string, name: string, url: string }`

## AcceptType 对照表

- `AcceptType.Image`：`.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg`
- `AcceptType.Video`：`.mp4,.webm,.ogg,.mov,.avi,.wmv,.flv,.mkv`
- `AcceptType.Audio`：`.mp3,.wav,.ogg,.aac,.flac,.m4a`
- `AcceptType.File`：`.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.zip,.rar,.7z,.tar,.gz`

## 与表单集成

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput' },
  // 将上传作为表单字段，支持字符串或列表两种模式
  { field: 'avatar', label: '头像', component: 'QuiUpload' }
]

// 生成常用上传配置
const uploadProps = useUploadProps({
  accept: AcceptType.Image,
  multiple: true,
  fileType: 'image-view'
})

/**
 * 函数：提交处理
 * 作用：获取并处理表单值（其中上传字段可能为字符串或文件列表）
 */
function handleSubmit(values: Record<string, any>) {
  // values.avatar 可能是字符串（url）或数组（id/name/url）
  console.log(values)
}
</script>

<template>
  <QuiForm :schemas="schemas">
    <template #avatar>
      <QuiUpload v-bind="uploadProps" />
    </template>
    <template #action-button>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
    </template>
  </QuiForm>
</template>
```

## 使用建议

- 单文件返回字符串：设置 `data-type='string'` 且 `max=1`
- 文件类型校验：优先使用 `AcceptType.*` 提供的枚举，确保与 `before-upload` 一致
- 大小限制：设置 `file-size` 并在 UI 上提示；错误信息通过 `@error` 查看
- 初始值回显：`is-set-fields-value=true` 时，字符串或列表均会自动生成已完成文件项
