<template>
  <component :is="layout">
    <router-view />
    <Toaster />
  </component>
</template>

<script>
import DefaultLayout from './layouts/default/DefaultLayout.vue'
import Toaster from './composables/alerts/toasts/Toaster.vue'

// eslint-disable-next-line sort-imports-es6-autofix/sort-imports-es6, no-unused-vars
import * as bootstrap from 'bootstrap'
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
