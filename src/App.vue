<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from './layouts/default/DefaultLayout.vue'
import '@/scss/app.scss'

export default {
  computed: {
    layout() {
      if (this.$route.meta.layout) return this.$route.meta.layout

      return DefaultLayout
    }
  },
  beforeMount: function () {
    this.$root.historyCount = window.history.length
  }
}
</script>
