<script>
export default {
  methods: {
    goBack: function () {
      window.history.length - this.$root.historyCount > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
</script>
