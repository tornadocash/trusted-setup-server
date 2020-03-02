<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="router-link">
        <Logo />
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="router-link" to="/instructions">
        Instructions
      </b-navbar-item>
      <b-navbar-item href="#">
        Download contributions
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: {
    Logo
  }
}
</script>
