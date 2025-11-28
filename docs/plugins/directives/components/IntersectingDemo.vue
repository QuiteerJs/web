<script setup lang="ts">
import { ref } from 'vue'

const status = ref({
  allStatus: false,
  showStatus: false,
  hideStatus: true
})

function onIntersect(isIntersecting: boolean) {
  console.log('相交状态：', isIntersecting)
  status.value.allStatus = isIntersecting
}

function onShow(isIntersecting: boolean) {
  console.log('进入视口：', isIntersecting)
  status.value.showStatus = true
}

function onHide(isIntersecting: boolean) {
  console.log('离开视口：', isIntersecting)
  status.value.hideStatus = true
}
</script>

<template>
  <n-alert title="监听全部状态" :type="status.allStatus ? 'info' : 'default'">
    {{ status.allStatus ? '进入视口：' : '未进入视口：' }}
  </n-alert>
  <n-alert title="只监听显示状态" :type="status.showStatus ? 'info' : 'error'">
    因为只监听了进入视口 所以只会触发一次
  </n-alert>  <n-alert title="只监听隐藏状态" :type="status.hideStatus ? 'info' : 'error'">
    因为只监听了离开视口 所以只会触发一次
  </n-alert>
  <n-scrollbar style="max-height: 320px">
    我们在田野上面找猪<br>
    想象中已找到了三只<br>
    小鸟在白云上面追逐<br>
    它们在树底下跳舞<br>
    啦啦啦啦啦啦啦啦咧<br>
    啦啦啦啦咧<br>
    我们在想象中度过了许多年<br>
    想象中我们是如此的疯狂<br>
    我们在城市里面找猪<br>
    想象中已找到了几百万只<br>
    小鸟在公园里面唱歌<br>
    它们独自在想象里跳舞<br>
    啦啦啦啦啦啦啦啦咧<br>
    啦啦啦啦咧<br>
    我们在想象中度过了许多年<br>
    许多年之后我们又开始想象<br>
    啦啦啦啦啦啦啦啦咧
    <!-- 参数模式：仅在离开视口时触发 -->
    <n-alert v-intersecting="onIntersect" title="监听全部状态" :type="status.allStatus ? 'info' : 'default'">
      {{ status.allStatus ? '进入视口：' : '未进入视口：' }}
    </n-alert>
    <n-alert v-intersecting:show="onShow" title="只监听显示状态" :type="status.showStatus ? 'info' : 'error'">
      因为只监听了进入视口 所以只会触发一次
    </n-alert>  <n-alert v-intersecting:hide="onHide" title="只监听隐藏状态" :type="status.hideStatus ? 'info' : 'error'">
      因为只监听了离开视口 所以只会触发一次
    </n-alert>
  </n-scrollbar>
</template>
