<script setup lang="ts">
import { QuiPopconfirmButton, QuiTooltipButton, QuiUpload, useUploadProps } from '@quiteer/naive-extra'

import { ref } from 'vue'

const { getUploadProps, getImageUploadProps, getAudioUploadProps, getVedioUploadProps } = useUploadProps({
  fileType: 'file',
  dataType: 'string'
})

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

<template>
  <n-flex>
    <n-card>
      <n-flex>
        <QuiPopconfirmButton title="确认删除吗？">
          确认对话按钮
        </QuiPopconfirmButton>
        <QuiTooltipButton tip="展示一些缩略详情">
          弹窗按钮
        </QuiTooltipButton>
      </n-flex>
    </n-card>
    <n-card>
      <n-upload v-model:file-list="list1" list-type="text" />
      <n-upload v-model:file-list="list1" list-type="image" />
      <n-upload v-model:file-list="list1" list-type="image-card" />
    </n-card>
    <n-card title="file" size="small">
      <QuiUpload v-bind="getUploadProps()" v-model:value="list1" file-type="file" />
    </n-card>
    <n-card title="dragger-file" size="small">
      <QuiUpload v-bind="getUploadProps()" v-model:value="list1" file-type="dragger-file" />
    </n-card>
    <n-card title="image-view" size="small">
      <QuiUpload v-bind="getImageUploadProps()" v-model:value="list1" file-type="image-view" />
    </n-card>
    <n-card title="video-view" size="small">
      <QuiUpload v-bind="getVedioUploadProps()" v-model:value="list2" file-type="video-view" />
    </n-card>
    <n-card title="audio-view" size="small">
      <QuiUpload v-bind="getAudioUploadProps()" v-model:value="list3" file-type="audio-view" />
    </n-card>
  </n-flex>
</template>
