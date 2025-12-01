<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

/**
 * 尝试对字符串进行 Base64 解码
 *
 * 根据内容是否符合 Base64 字符集与等号填充进行粗略判断，然后尝试解码；
 * 失败或不符合模式时返回原值。
 *
 * @param input - 原始字符串，通常来自 `import.meta.env`
 * @returns 解码后的字符串或原始字符串
 *
 * @example
 * ```ts
 * decodeMaybe('aGVsbG8=') // 'hello'
 * decodeMaybe('http://localhost:3000') // 原样返回
 * ```
 *
 * @remarks
 * - 仅用于演示 base64 混淆；强加密如 AES 需服务端或安全密钥解密
 *
 * @security
 * - 客户端解密仅限混淆用途，敏感信息不应下发到前端
 *
 * @performance
 * - 解码为 O(n) 字符处理，开销极小
 */
function decodeMaybe(input: string): string {
  const looksBase64 = /^[A-Z0-9+/=]+$/i.test(input) && input.length % 4 === 0
  if (!looksBase64)
    return input
  try {
    const bin = atob(input)
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  }
  catch {
    return input
  }
}

/**
 * 收集并展示关键环境变量的原值与解码值
 */
const envPairs = [
  'VITE_NAME',
  'VITE_BASEURL',
  'VITE_APIURL',
  'VITE_UPLOADURL',
  'VITE_GISJS',
  'VITE_GISCSS',
  'VITE_TITLE'
].map((key) => {
  const raw = (import.meta.env as Record<string, string>)[key]
  const decoded = raw != null ? decodeMaybe(String(raw)) : ''
  return { key, raw, decoded }
})
</script>

<template>
  <h1>{{ msg }}!</h1>

  <div class="card">
    <button type="button" @click="count++">
      count is {{ count }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <div>
    <h3>环境变量读取</h3>
    <p>以下展示原值（raw）与解码值（decoded）：</p>
    <ul>
      <li v-for="item in envPairs" :key="item.key">
        <code>{{ item.key }}</code>
        = raw: <code>{{ item.raw }}</code>
        , decoded: <code>{{ item.decoded }}</code>
      </li>
    </ul>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
    >Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">
    Click on the Vite and Vue logos to learn more
  </p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
