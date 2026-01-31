import type { FormSchema, QuiForm, UploadProps } from '@quiteer/naive-extra'
import type { CascaderOption, CascaderProps, DatePickerProps, InputNumberProps, InputProps, SelectProps } from 'naive-ui'
import { useForm } from '@quiteer/naive-extra'
import { reactive, ref } from 'vue'

/**
 * 基础表单演示页面的逻辑处理
 *
 * 封装了表单配置、数据初始化、动态操作及校验逻辑。
 *
 * @returns 包含表单状态、配置及操作方法的对象
 */
export function useBasicForm() {
  function getOptions(depth = 3, iterator = 1, prefix = '') {
    const length = 12
    const options: CascaderOption[] = []
    for (let i = 1; i <= length; ++i) {
      if (iterator === 1) {
        options.push({
          value: `v-${i}`,
          label: `l-${i}`,
          disabled: i % 5 === 0,
          children: getOptions(depth, iterator + 1, `${String(i)}`)
        })
      }
      else if (iterator === depth) {
        options.push({
          value: `v-${prefix}-${i}`,
          label: `l-${prefix}-${i}`,
          disabled: i % 5 === 0
        })
      }
      else {
        options.push({
          value: `v-${prefix}-${i}`,
          label: `l-${prefix}-${i}`,
          disabled: i % 5 === 0,
          children: getOptions(depth, iterator + 1, `${prefix}-${i}`)
        })
      }
    }
    return options
  }

  const options = [
    {
      label: '选项1',
      value: '1'
    },
    {
      label: '选项2',
      value: '2'
    }
  ]

  const schemas = reactive<FormSchema[]>([
    {
      field: 'input',
      label: '输入框',
      component: 'NInput',
      rules: [{ required: true, trigger: ['blur', 'input'], message: '请输入内容' }],
      componentProps: {} as InputProps
    },
    {
      field: 'custom',
      label: '自定义的插槽',
      slot: 'custom',
      rules: [{ required: true, trigger: ['blur', 'input'], message: '请输入内容' }]
    },
    {
      field: 'number-input',
      label: '数字输入框',
      component: 'NInputNumber',
      rules: [{ required: true, type: 'number', trigger: ['blur', 'change'], message: '请输入数字' }],
      componentProps: {} as InputNumberProps
    },
    {
      field: 'select',
      label: '选择框',
      component: 'NSelect',
      rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择选项' }],
      componentProps: {
        options
      } as SelectProps
    },
    {
      field: 'cascader',
      label: '级联选择',
      component: 'NCascader',
      rules: [{ required: true, trigger: ['blur', 'change'], message: '请选择选项' }],
      componentProps: {
        options: getOptions()
      } as CascaderProps
    },
    {
      field: 'time-picker',
      label: '时间选择器',
      component: 'NTimePicker',
      rules: [{ required: true, type: 'number', trigger: ['blur', 'change'], message: '请选择时间' }]
    },
    {
      field: 'date-picker',
      label: '日期选择器',
      component: 'NDatePicker',
      rules: [{ required: true, type: 'number', trigger: ['blur', 'change'], message: '请选择日期' }]
    },
    {
      field: 'date-picker-range',
      label: '日期范围选择器',
      component: 'NDatePicker',
      rules: [{ required: true, type: 'array', trigger: ['blur', 'change'], message: '请选择日期范围' }],
      componentProps: {
        type: 'daterange'
      } as DatePickerProps
    },
    {
      field: 'checkbox',
      label: '复选框',
      component: 'NCheckbox',
      rules: [{ required: true, type: 'array', trigger: ['blur', 'change'], message: '请选择复选框' }],
      componentProps: {
        options
      }
    },
    {
      field: 'radio',
      label: '单选',
      component: 'NRadioGroup',
      defaultValue: '1',
      componentProps: {
        options
      }
    },
    {
      field: 'switch',
      label: '开关',
      component: 'NSwitch',
      defaultValue: true,
      componentProps: {
        options
      }
    },
    {
      field: 'upload',
      label: '上传',
      component: 'NUpload',
      rules: [{ required: true, type: 'array', trigger: ['blur', 'change'], message: '请上传文件' }],
      componentProps: {
        fileType: 'image-view'
      } as UploadProps
    }
  ])

  const formRef = ref<InstanceType<typeof QuiForm>>()
  const {
    setOptions,
    setComponentProps,
    setDefaultValue,
    upsertSchema,
    replaceSchema,
    removeSchema,
    listFields,
    toRulesMap,
    validate,
    resetFields,
    clearValidate,
    getFieldsValue
  } = useForm(schemas, formRef)

  const formState = ref({})
  const inline = ref(true)
  const debugFields = ref<string[]>([])
  const debugRules = ref<Record<string, any[]>>({})

  async function loadSelectOptions() {
    const opts = await Promise.resolve([
      { label: '选项A', value: 'A' },
      { label: '选项B', value: 'B' },
      { label: '选项C', value: 'C' }
    ])
    setOptions('select', opts)
    setComponentProps('select', { clearable: true, filterable: true })
    setDefaultValue('select', 'B')
  }

  function handleSubmit(model: any) {
    console.info('model: ', model)
    formState.value = getFieldsValue() || {}
  }

  function handleReset() {
    resetFields()
    clearValidate()
  }

  async function handleValidate() {
    await validate()
  }

  function showFields() {
    debugFields.value = listFields()
  }

  function showRules() {
    debugRules.value = toRulesMap()
  }

  function patchSelectToFilterable() {
    setComponentProps('select', { filterable: true, clearable: true })
  }

  function setSelectDefaultB() {
    setDefaultValue('select', 'B')
  }

  function replaceNumberToInput() {
    replaceSchema('number-input', { component: 'NInput' })
  }

  function addDynamicField() {
    upsertSchema({
      field: 'dynamic-field',
      label: '动态字段',
      component: 'NInput',
      defaultValue: '动态值'
    })
  }

  function removeDynamicField() {
    removeSchema('dynamic-field')
  }

  function fillValuesQuickly() {
    formRef.value?.setFieldsValue({
      input: 'Hello UseForm',
      select: '1'
    })
  }

  return {
    schemas,
    formRef,
    formState,
    inline,
    debugFields,
    debugRules,
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
  }
}
