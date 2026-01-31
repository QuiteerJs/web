<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { QuiForm } from '@quiteer/naive-extra'

definePage({
  name: 'FormLayoutDemo',
  meta: {
    title: '表单布局',
    icon: 'vaadin:form',
    order: 2
  }
})

const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入姓名'
    }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    componentProps: {
      placeholder: '请输入年龄',
      class: 'w-full'
    }
  },
  {
    field: 'role',
    label: '角色',
    component: 'NSelect',
    componentProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ]
    }
  },
  {
    field: 'remark',
    label: '备注',
    component: 'NInput',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入备注'
    },
    giProps: {
      span: 24
    }
  }
]

const gridSchemas: FormSchema[] = [
  {
    field: 'f1',
    label: '字段 1',
    component: 'NInput'
  },
  {
    field: 'f2',
    label: '字段 2',
    component: 'NInput'
  },
  {
    field: 'f3',
    label: '字段 3',
    component: 'NInput'
  },
  {
    field: 'f4',
    label: '占位 2 列',
    component: 'NInput',
    giProps: {
      span: 2
    }
  },
  {
    field: 'f5',
    label: '字段 5',
    component: 'NInput'
  }
]
</script>

<template>
  <n-space vertical size="large">
    <!-- 1. 顶部标签布局 (默认) -->
    <n-card title="顶部标签布局 (Label Placement: Top)" size="small">
      <QuiForm :schemas="schemas" label-placement="top" />
    </n-card>

    <!-- 2. 左侧标签布局 -->
    <n-card title="左侧标签布局 (Label Placement: Left)" size="small">
      <QuiForm :schemas="schemas" label-placement="left" :label-width="100" />
    </n-card>

    <!-- 3. 行内布局 -->
    <n-card title="行内布局 (Inline)" size="small">
      <QuiForm :schemas="schemas.slice(0, 3)" inline />
    </n-card>

    <!-- 4. 网格多列布局 (3列) -->
    <n-card title="网格多列布局 (3 Columns Grid)" size="small">
      <QuiForm
        :schemas="gridSchemas"
        :grid-props="{ cols: 3, xGap: 12 }"
        label-placement="top"
      />
    </n-card>

    <!-- 5. 响应式布局示例 -->
    <n-card title="响应式布局 (Responsive Grid)" size="small">
      <div class="mb-4 text-gray-400">
        调整窗口大小观察列数变化 (cols: '1 s:2 m:3 l:4')
      </div>
      <QuiForm
        :schemas="[...gridSchemas, ...gridSchemas]"
        :grid-props="{ cols: '1 s:2 m:3 l:4', xGap: 12, responsive: 'screen' }"
      />
    </n-card>
  </n-space>
</template>

<style scoped>
.w-full {
  width: 100%;
}
</style>
