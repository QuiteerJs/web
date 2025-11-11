<script setup lang="ts">
import { AcceptType, QuiUpload } from '@quiteer/naive-extra'
import { ref } from 'vue'

// 上传接口配置（示例值，按需替换）
const action = '/api/upload'
const headers = { Authorization: 'Bearer token' }
const data = { dir: 'demo' }

// 场景一：单文件字符串返回模式（dataType='string'，max=1）
const fileUrl = ref<string | undefined>()

/**
 * 函数：设置单文件初始值
 * 作用：演示 isSetFieldsValue=true 时，组件如何根据字符串 v-model 展示已完成的文件
 */
function setStringInitial() {
  fileUrl.value = 'https://example.com/demo.pdf'
}

/**
 * 函数：清空单文件值
 * 作用：将字符串模式的 v-model 清空
 */
function clearStringValue() {
  fileUrl.value = undefined
}

// 场景二：图片卡片列表（多文件，image-card 预览）
interface FileItem { id: string, name: string, url: string }
const imageList = ref<FileItem[] | undefined>([
  { id: '1', name: '示例图片1', url: 'https://picsum.photos/300/200?random=1' },
  { id: '2', name: '示例图片2', url: 'https://picsum.photos/300/200?random=2' }
])

/**
 * 函数：重置图片列表
 * 作用：清空多文件模式的 v-model 数组
 */
function resetImages() {
  imageList.value = []
}

/**
 * 函数：追加一张示例图片
 * 作用：向 v-model 列表中追加一个演示项
 */
function addDemoImage() {
  const id = String(Math.random()).slice(2, 8)
  const url = `https://picsum.photos/300/200?random=${id}`
  const name = `示例图片${id}`
  imageList.value = [...(imageList.value ?? []), { id, name, url }]
}
</script>

<template>
  <div style="display: grid; gap: 24px;">
    <!-- 场景一：拖拽上传，单文件字符串返回 -->
    <section style="border: 1px solid #eee; padding: 16px; border-radius: 8px;">
      <h3 style="margin: 0 0 12px;">
        拖拽上传（单文件字符串返回）
      </h3>
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
        <button @click="setStringInitial">
          设为示例字符串
        </button>
        <button @click="clearStringValue">
          清空
        </button>
        <span>当前值：{{ fileUrl || '空' }}</span>
      </div>

      <QuiUpload
        v-model:value="fileUrl"
        file-type="dragger-file"
        data-type="string"
        :max="1"
        :is-set-fields-value="true"
        :accept="AcceptType.File"
        :action="action"
        :headers="headers"
        :data="data"
      />
      <p style="color: #666; margin-top: 8px;">
        说明：上传成功后 v-model 将被设置为文件的 URL 字符串；当提供初始字符串且 isSetFieldsValue=true 时，会展示为已上传状态。
      </p>
    </section>

    <!-- 场景二：图片卡片列表，多文件 -->
    <section style="border: 1px solid #eee; padding: 16px; border-radius: 8px;">
      <h3 style="margin: 0 0 12px;">
        图片卡片列表（多文件）
      </h3>
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
        <button @click="addDemoImage">
          追加示例图片
        </button>
        <button @click="resetImages">
          重置
        </button>
        <span>当前数量：{{ (imageList?.length ?? 0) }}</span>
      </div>

      <QuiUpload
        v-model:value="imageList"
        file-type="image-view"
        :max="5"
        :file-size="2"
        :is-set-fields-value="true"
        :accept="AcceptType.Image"
        :action="action"
        :headers="headers"
        :data="data"
      />
      <p style="color: #666; margin-top: 8px;">
        说明：图片模式使用内部的 image-card 展示；v-model 为列表形式，项包含 id/name/url。
      </p>
    </section>
  </div>
</template>
