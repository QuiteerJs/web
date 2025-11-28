import { defineConfig } from 'qvite'

export default defineConfig((env) => {
  console.log('env: ', env)
  return {
    port: 8090
  }
})
