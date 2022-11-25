<template>
  <div id="app">
    <DebugTool />
  </div>
</template>

<script>
import DebugTool from '@/components/DebugTool.vue';

export default {
  name: 'App',
  components: {
    DebugTool
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
