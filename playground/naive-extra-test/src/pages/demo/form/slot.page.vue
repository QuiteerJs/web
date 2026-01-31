<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { QuiForm } from '@quiteer/naive-extra'
import { useMessage } from 'naive-ui'

definePage({
  name: 'FormSlotDemo',
  meta: {
    title: '表单插槽',
    icon: 'qlementine-icons:empty-slot-16',
    order: 4
  }
})

const message = useMessage()

const schemas: FormSchema[] = [
  {
    field: 'customInput',
    label: '自定义内容插槽',
    slot: 'custom-field', // 指定插槽名称
    labelMessage: '通过 slot 属性自定义整个表单项内容'
  },
  {
    field: 'withSuffix',
    label: '带后缀插槽',
    component: 'NInput',
    suffix: 'field-suffix', // 指定后缀插槽名称
    componentProps: {
      placeholder: '请输入金额'
    }
  },
  {
    field: 'selectWithIcon',
    label: '自定义后缀图标',
    component: 'NSelect',
    suffix: 'select-icon',
    componentProps: {
      options: [
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' }
      ]
    }
  }
]

function handleSubmit(model: any) {
  console.info('表单提交数据:', model)
  message.success('提交成功，请查看控制台')
}
</script>

<template>
  <n-space vertical size="large">
    <n-card title="表单插槽示例" size="small">
      <QuiForm :schemas="schemas" label-placement="left" :label-width="140">
        <!-- 1. 自定义内容插槽 -->
        <template #custom-field="{ model, field }">
          <n-input-group>
            <n-input v-model:value="model[field]" placeholder="完全自定义的输入组合" />
            <n-button type="primary" ghost>
              检查
            </n-button>
          </n-input-group>
        </template>

        <!-- 2. 后缀插槽 -->
        <template #field-suffix>
          <span class="ml-2 text-gray-400">元</span>
        </template>

        <!-- 3. 组件后面的图标/提示插槽 -->
        <template #select-icon="{ value }">
          <div class="ml-2 flex items-center">
            <n-tag v-if="value === 'vue'" type="success" size="small">
              推荐
            </n-tag>
            <n-icon v-else size="18" class="text-gray-400">
              <div class="i-material-symbols-info-outline" />
            </n-icon>
          </div>
        </template>

        <!-- 4. 操作按钮插槽 -->
        <template #action-button="{ model }">
          <n-space>
            <n-button type="primary" @click="handleSubmit(model)">
              保存数据
            </n-button>
            <n-button ghost @click="() => message.info('点击了取消')">
              返回
            </n-button>
          </n-space>
        </template>
      </QuiForm>
    </n-card>

    <n-card title="插槽说明" size="small">
      <n-descriptions bordered label-placement="left" :column="1">
        <n-descriptions-item label="slot">
          在 <code>FormSchema</code> 中定义 <code>slot</code>，可以完全接管该字段的渲染逻辑。
        </n-descriptions-item>
        <n-descriptions-item label="suffix">
          在 <code>FormSchema</code> 中定义 <code>suffix</code>，可以在组件右侧插入自定义内容（如单位、图标、标签等）。
        </n-descriptions-item>
        <n-descriptions-item label="action-button">
          表单底部的操作区域插槽，常用于放置提交、重置等按钮。
        </n-descriptions-item>
        <n-descriptions-item label="label">
          可以通过 <code>labelMessage</code> 配合内置逻辑实现标签旁边的问号提示。
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </n-space>
</template>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
</style>
