<template>
  <b-loading :active.sync="loading">
    <div class="loading-container">
      <div class="loading-tornado"></div>
      <div class="loading-message">{{ message }}...</div>
    </div>
  </b-loading>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      message: 'Loading'
    }
  },
  created() {
    this.$root.$on('enableLoading', (msg = 'Loading') => {
      this.loading = true
      this.message = msg
    })
    this.$root.$on('disableLoading', () => {
      this.loading = false
    })
  }
}
</script>
