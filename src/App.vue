<template>
  <component :is="layout">
    <router-view />
    <Toaster />
  </component>
</template>

<script>
import DefaultLayout from './layouts/default/DefaultLayout.vue'
import Toaster from './mixins/alerts/Toaster.vue'
import '@/scss/app.scss'

export default {
  components: { Toaster },
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
