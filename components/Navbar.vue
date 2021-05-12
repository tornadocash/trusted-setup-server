<template>
  <b-navbar wrapper-class="container" class="header">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="router-link">
        <img src="../assets/img/sherpalogo.png" />
        <div class="sherpa-header-label">Sherpa</div>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item tag="router-link" to="/instructions">
        Instructions
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
