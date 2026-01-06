<script setup lang="ts">
import { useTableTheme } from '@quiteer/naive-extra'
import { NCard, NColorPicker, NConfigProvider, NDataTable, NForm, NFormItem, NInput, NSpace, NSwitch } from 'naive-ui'
import { computed, ref } from 'vue'

const { configRef, reset, getConfigProps } = useTableTheme({
  tableColor: '#ffffff',
  tableHeaderColor: '#f7f7f7',
  tableColorStriped: '#fafafa',
  tableColorHover: '#eeeeee',
  tdPaddingHorizontal: '12px',
  tdPaddingVertical: '12px',
  thPaddingHorizontal: '12px',
  thPaddingVertical: '12px'
})

const isStriped = ref(false)

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

const configProps = computed(() => getConfigProps())
</script>

<template>
  <div class="p-6">
    <NSpace vertical size="large">
      <NCard title="表格主题定制">
        <NForm label-placement="left" :label-width="120">
          <NSpace vertical>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="表格背景色">
                <NColorPicker
                  v-model:value="configRef.tableColor"
                  :show-alpha="false"
                />
              </NFormItem>
              <NFormItem label="表头背景色">
                <NColorPicker
                  v-model:value="configRef.tableHeaderColor"
                  :show-alpha="false"
                />
              </NFormItem>
              <NFormItem label="斑马纹颜色">
                <NColorPicker
                  v-model:value="configRef.tableColorStriped"
                  :show-alpha="false"
                />
              </NFormItem>
              <NFormItem label="悬浮行颜色">
                <NColorPicker
                  v-model:value="configRef.tableColorHover"
                  :show-alpha="false"
                />
              </NFormItem>
              <NFormItem label="TD 横向内边距">
                <NInput v-model:value="configRef.tdPaddingHorizontal" placeholder="如: 12px" />
              </NFormItem>
              <NFormItem label="TD 纵向内边距">
                <NInput v-model:value="configRef.tdPaddingVertical" placeholder="如: 12px" />
              </NFormItem>
              <NFormItem label="TH 横向内边距">
                <NInput v-model:value="configRef.thPaddingHorizontal" placeholder="如: 12px" />
              </NFormItem>
              <NFormItem label="TH 纵向内边距">
                <NInput v-model:value="configRef.thPaddingVertical" placeholder="如: 12px" />
              </NFormItem>
            </div>
            <NFormItem label="启用斑马纹">
              <NSwitch v-model:value="isStriped" />
            </NFormItem>
            <div class="flex justify-end">
              <button
                class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                @click="reset"
              >
                重置配置
              </button>
            </div>
          </NSpace>
        </NForm>
      </NCard>

      <NCard title="预览效果">
        <NConfigProvider v-bind="configProps">
          <NDataTable
            :columns="columns"
            :data="data"
            :striped="isStriped"
          />
        </NConfigProvider>
      </NCard>

      <NCard title="当前配置 JSON">
        <pre class="bg-gray-100 p-4 rounded overflow-auto text-xs">{{ JSON.stringify(configRef, null, 2) }}</pre>
      </NCard>
    </NSpace>
  </div>
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
