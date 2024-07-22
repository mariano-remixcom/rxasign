<template>
  <div class="mb-2">
    <div class="text-black-50 fw-light">{{ label }}</div>
    <div class="h4 m-0 fw-bold">{{ value }}</div>
    <div v-if="!!helper" class="text-black-50 fw-light">{{ helper }}</div>
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
