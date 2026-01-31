<script setup lang="ts">
import type { FormSchema } from '@quiteer/naive-extra'
import { QuiForm, useForm } from '@quiteer/naive-extra'
import { useMessage } from 'naive-ui'

definePage({
  name: 'FormValidateDemo',
  meta: {
    title: '表单校验',
    icon: 'fluent:form-new-24-regular',
    order: 3
  }
})

const message = useMessage()
const formRef = ref<InstanceType<typeof QuiForm>>()

const schemas: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'NInput',
    rules: [
      { required: true, message: '请输入用户名', trigger: ['blur', 'input'] },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: ['blur', 'input'] }
    ]
  },
  {
    field: 'password',
    label: '密码',
    component: 'NInput',
    componentProps: {
      type: 'password',
      showPasswordOn: 'mousedown'
    },
    rules: [
      { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
      {
        validator: (_rule: any, value: string) => {
          if (!value)
            return new Error('请输入密码')
          if (!/^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8,}$/i.test(value)) {
            return new Error('密码至少8位，且包含数字和字母')
          }
          return true
        },
        trigger: ['blur', 'input']
      }
    ]
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'NInput',
    componentProps: {
      type: 'password'
    },
    rules: [
      { required: true, message: '请再次输入密码', trigger: ['blur', 'input'] },
      {
        validator: (_rule: any, value: string) => {
          const values = formRef.value?.getFieldsValue()
          if (value !== values?.password) {
            return new Error('两次输入的密码不一致')
          }
          return true
        },
        trigger: ['blur', 'input']
      }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'NInput',
    rules: [
      { required: true, message: '请输入邮箱', trigger: ['blur', 'input'] },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
    ]
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'NInput',
    rules: [
      { required: true, message: '请输入手机号', trigger: ['blur', 'input'] },
      {
        validator: (_rule: any, value: string) => {
          if (!/^1[3-9]\d{9}$/.test(value)) {
            return new Error('请输入正确的手机号格式')
          }
          return true
        },
        trigger: ['blur', 'input']
      }
    ]
  },
  {
    field: 'age',
    label: '年龄',
    component: 'NInputNumber',
    rules: [
      { required: true, type: 'number', message: '请输入年龄', trigger: ['blur', 'change'] },
      { type: 'number', min: 18, max: 60, message: '年龄必须在 18 到 60 岁之间', trigger: ['blur', 'change'] }
    ]
  }
]

const { validate, resetFields, clearValidate, getFieldsValue } = useForm(schemas, formRef)

async function handleSubmit() {
  try {
    await validate()
    const values = getFieldsValue()
    console.info('校验通过:', values)
    message.success('表单校验通过！内容已打印至控制台')
  }
  catch (errors) {
    console.error('校验失败:', errors)
    message.error('表单校验失败，请检查输入')
  }
}

function handleReset() {
  resetFields()
  message.info('表单已重置')
}

function handleClear() {
  clearValidate()
  message.info('校验状态已清除')
}
</script>

<template>
  <n-card title="表单校验示例" size="small">
    <template #header-extra>
      <n-space>
        <n-button type="primary" @click="handleSubmit">
          提交验证
        </n-button>
        <n-button @click="handleReset">
          重置表单
        </n-button>
        <n-button @click="handleClear">
          清除校验状态
        </n-button>
      </n-space>
    </template>

    <div class="max-w-800px mx-auto py-4">
      <QuiForm
        ref="formRef"
        :schemas="schemas"
        label-placement="left"
        :label-width="100"
      />
    </div>

    <n-divider title-placement="left">
      校验规则说明
    </n-divider>
    <n-alert title="校验提示" type="info" :bordered="false">
      <ul>
        <li><b>基础校验</b>：利用 <code>required</code>, <code>min</code>, <code>max</code>, <code>type</code> 等内置规则。</li>
        <li><b>自定义校验</b>：通过 <code>validator</code> 函数实现复杂逻辑（如密码强度、两次密码一致性、正则匹配等）。</li>
        <li><b>异步支持</b>：校验过程是异步的，可以通过 <code>await validate()</code> 捕获结果。</li>
      </ul>
    </n-alert>
  </n-card>
</template>

<style scoped>
.max-w-800px {
  max-width: 800px;
}
</style>
