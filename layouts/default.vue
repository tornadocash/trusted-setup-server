<template>
  <div class="wrapper">
    <Navbar />
    <section class="main-content section">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <Loading />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Loading from '@/components/Loading'

export default {
  components: {
    Navbar,
    Loading
  }
}
</script>
