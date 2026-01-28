<script setup lang="ts">
import { useProviderContext } from '@quiteer/naive-extra'
import { NButton, NCard, NColorPicker, NDataTable, NForm, NFormItem, NInput, NSpace, NSwitch } from 'naive-ui'
import { ref, watch } from 'vue'

definePage({
  meta: {
    title: '定制表格',
    icon: 'teenyicons:table-solid',
    order: 10
  }
})

const { mergedConfig, updateConfig } = useProviderContext()

// 使用 ref 存储本地编辑的配置
const tableConfig = ref({ ...mergedConfig.value.table })

// 深度监听 tableConfig 的变化并同步到 Provider
watch(tableConfig, (newVal) => {
  updateConfig({ table: { ...newVal } })
}, { deep: true })

// 如果全局配置从外部发生变化（比如通过 store 切换主题），同步到本地 ref
watch(() => mergedConfig.value.table, (newVal) => {
  // 简单判断是否需要更新，避免循环更新
  if (JSON.stringify(newVal) !== JSON.stringify(tableConfig.value)) {
    tableConfig.value = { ...newVal }
  }
}, { deep: true })

function reset() {
  updateConfig({ table: {} })
}

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
  { title: 'Tags', key: 'tags' }
]

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', tags: 'nice, developer' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', tags: 'wow' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', tags: 'cool, teacher' }
]
</script>

<template>
  <NSpace vertical size="large">
    <NCard title="表格主题定制">
      <NForm label-placement="left" :label-width="120">
        <NSpace vertical>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="表格背景色">
              <NColorPicker
                v-model:value="tableConfig.tableColor"
                :show-alpha="false"
              />
            </NFormItem>
            <NFormItem label="表头背景色">
              <NColorPicker
                v-model:value="tableConfig.tableHeaderColor"
                :show-alpha="false"
              />
            </NFormItem>
            <NFormItem label="斑马纹颜色">
              <NColorPicker
                v-model:value="tableConfig.tableColorStriped"
                :show-alpha="false"
              />
            </NFormItem>
            <NFormItem label="悬浮行颜色">
              <NColorPicker
                v-model:value="tableConfig.tableColorHover"
                :show-alpha="false"
              />
            </NFormItem>
            <NFormItem label="TD 横向内边距">
              <NInput v-model:value="tableConfig.tdPaddingHorizontal" placeholder="如: 12px" />
            </NFormItem>
            <NFormItem label="TD 纵向内边距">
              <NInput v-model:value="tableConfig.tdPaddingVertical" placeholder="如: 12px" />
            </NFormItem>
            <NFormItem label="TH 横向内边距">
              <NInput v-model:value="tableConfig.thPaddingHorizontal" placeholder="如: 12px" />
            </NFormItem>
            <NFormItem label="TH 纵向内边距">
              <NInput v-model:value="tableConfig.thPaddingVertical" placeholder="如: 12px" />
            </NFormItem>
          </div>
          <NFormItem label="启用斑马纹">
            <NSwitch v-model:value="tableConfig.striped" />
          </NFormItem>
          <div class="flex justify-end">
            <NButton
              @click="reset"
            >
              重置配置
            </NButton>
          </div>
        </NSpace>
      </NForm>
    </NCard>

    <NCard title="预览效果">
      <NDataTable
        :columns="columns"
        :data="data"
        :striped="tableConfig.striped"
      />
    </NCard>

    <NCard title="当前配置 JSON">
      <pre class="p-4 rounded overflow-auto text-xs">{{ JSON.stringify(tableConfig, null, 2) }}</pre>
    </NCard>
  </NSpace>
</template>

<style scoped>
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.gap-4 {
  gap: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
</style>
