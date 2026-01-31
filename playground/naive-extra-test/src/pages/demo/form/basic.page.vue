<script setup lang="ts">
import { QuiForm } from '@quiteer/naive-extra'
import { useBasicForm } from './modules/useBasicForm'

definePage({
  name: 'BasicForm',
  meta: {
    title: '表单示例',
    order: 1
  }
})

const {
  schemas,
  formRef,
  inline,
  loadSelectOptions,
  handleSubmit,
  handleReset,
  handleValidate,
  showFields,
  showRules,
  patchSelectToFilterable,
  setSelectDefaultB,
  replaceNumberToInput,
  addDynamicField,
  removeDynamicField,
  fillValuesQuickly
} = useBasicForm()
</script>

<template>
  <n-card title="适用大部分场景的表单" size="small">
    <n-card title="控制表单">
      <n-space>
        <n-button type="primary" @click="handleValidate">
          校验
        </n-button>
        <n-button type="primary" @click="handleReset">
          重置
        </n-button>
        <n-button type="primary" @click="loadSelectOptions">
          异步加载选择框选项
        </n-button>
        <n-button @click="patchSelectToFilterable">
          选择框支持过滤/清空
        </n-button>
        <n-button @click="setSelectDefaultB">
          选择框默认值设为 B
        </n-button>
        <n-button @click="replaceNumberToInput">
          将数字输入替换为普通输入
        </n-button>
        <n-button @click="addDynamicField">
          新增动态字段
        </n-button>
        <n-button type="error" @click="removeDynamicField">
          移除动态字段
        </n-button>
        <n-button type="warning" @click="fillValuesQuickly">
          批量填充值
        </n-button>
        <n-button @click="showFields">
          列出字段
        </n-button>
        <n-button @click="showRules">
          导出规则映射
        </n-button>
        <n-button type="primary" @click="inline = !inline">
          更换布局
        </n-button>
      </n-space>
    </n-card>
    <n-card>
      <QuiForm
        ref="formRef"
        :schemas="schemas"
        :inline="inline"
        label-placement="left"
        label-width="130"
      >
        <template #custom="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
        <template #action-button="{ model }">
          <n-button type="primary" @click="handleSubmit(model)">
            提交
          </n-button>
        </template>
      </QuiForm>
    </n-card>
  </n-card>
</template>

<style lang="scss" scoped></style>
