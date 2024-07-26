<template>
  <div class="mb-2">
    <div class="text-muted">
      <small>{{ label }}</small>
    </div>
    <div class="h5 m-0 fw-semibold">{{ value }}</div>
    <div v-if="!!helper" class="text-muted">
      <small>{{ helper }}</small>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    helper: {
      default: null,
      type: String,
      required: false
    }
  }
}
</script>
