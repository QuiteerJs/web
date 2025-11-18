# QuiForm 组件

## 基本用法

<script setup lang="ts">
import FormDemo from './components/FormDemo.vue'
</script>

<ClientOnly>
  <Demo />
  <FormDemo />
</ClientOnly>

## 属性（Props）

- `schemas`：表单字段定义数组，包含 `field`、`label`、`component`、`rules` 等
- `model`：初始表单值对象（可选）
- `size`：表单尺寸，常用 `'small' | 'medium' | 'large'`
- `layout`：布局配置，如 `labelPlacement`、`labelWidth` 等（透传 `naive-ui` 表单属性）

## 插槽（Slots）

- `action-button`：操作区按钮插槽（提交、重置、导出等）
- 自定义字段插槽：以字段名为插槽名，替换某个字段的默认渲染

## 实例方法（Ref）

- `validate`：触发表单校验（返回 `Promise`）
- `resetFields`：重置表单到初始值
- `clearValidate`：清除校验状态
- `getFieldsValue`：获取当前表单值对象
- `setFieldsValue`：批量设置表单字段值

## 示例：定义与提交

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { QuiForm } from '@quiteer/naive-extra'
import { ref } from 'vue'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput', rules: [{ required: true, message: '请输入姓名' }] },
  { field: 'age', label: '年龄', component: 'NInputNumber' }
]

const formRef = ref<any>()

/**
 * 函数：提交表单
 * 作用：触发校验并获取表单值，用于后续请求或处理
 */
async function handleSubmit() {
  await formRef.value?.validate()
  const values = formRef.value?.getFieldsValue()
  console.log('submit values:', values)
}

/**
 * 函数：设置演示初始值
 * 作用：批量设置字段，演示 setFieldsValue 用法
 */
function setInitialValues() {
  formRef.value?.setFieldsValue({ name: '张三', age: 20 })
}

/**
 * 函数：清空表单
 * 作用：重置字段到初始值并清除校验状态
 */
function resetForm() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}
</script>

<template>
  <QuiForm ref="formRef" :schemas="schemas">
    <template #action-button>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
      <NButton @click="setInitialValues">
        设为示例初始值
      </NButton>
      <NButton @click="resetForm">
        重置
      </NButton>
    </template>
  </QuiForm>
</template>
```

## 与上传组件集成

```vue
<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { AcceptType, QuiForm, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

const schemas: FormSchema[] = [
  { field: 'name', label: '姓名', component: 'NInput' },
  { field: 'avatar', label: '头像', component: 'QuiUpload' }
]

const uploadProps = useUploadProps({
  accept: AcceptType.Image,
  multiple: true,
  fileType: 'image-view'
})

/**
 * 函数：表单提交
 * 作用：处理包含上传字段的表单值（可能是字符串或文件列表）
 */
function handleSubmit(values: Record<string, any>) {
  console.log('values:', values)
}
</script>

<template>
  <QuiForm :schemas="schemas" @submit="handleSubmit">
    <template #avatar>
      <QuiUpload v-bind="uploadProps" />
    </template>
  </QuiForm>
</template>
```

## 提示

- 复杂字段建议使用自定义插槽以获得更高的灵活性
- 表单值获取与设置均通过实例方法完成，避免手动维护本地状态
