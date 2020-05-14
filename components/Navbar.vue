<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="router-link">
        <Logo />
      </b-navbar-item>
    </template>
    <template slot="end">
      <a
        class="navbar-item"
        target="_blank"
        href="https://medium.com/@tornado.cash/the-biggest-trusted-setup-ceremony-in-the-world-3c6ab9c8fffa#43d9"
      >
        Instructions
      </a>
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
