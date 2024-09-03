<template v-if="!!stateKey && !!state">
  <div class="d-flex flex-row gap-1 justify-items-center align-items-center">
    <i :class="`bi bi-${state.icon} text-${state.color}`"></i>
    <div class="h6 mb-0" :class="`text-${state.color}`">{{ state.displayName }}</div>
  </div>
</template>
<script>
import { PROJECT_STATES } from '@/constants/ProjectStates'
import { ref, watch } from 'vue'

export default {
  props: {
    stateKey: {
      type: String,
      required: true
    },
    style: {
      type: String,
      default: 'normal'
    }
  },
  setup(props) {
    const state = ref(null)

    function setState(key) {
      state.value = PROJECT_STATES.find((state) => state.key === key)
    }

    setState(props.stateKey)

    watch(props.stateKey, setState)

    return { state }
  }
}
</script>
<style lang="scss">
.text-gray-600 {
  color: $gray-600;
}
.text-gray-400 {
  color: $gray-400;
}
</style>
