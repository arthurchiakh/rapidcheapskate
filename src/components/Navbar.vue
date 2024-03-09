<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <img src="/img/my100.png" style="height: 28px; width: auto; margin-right: 5px" />
        <h2>Rapid Cheapskate</h2>
      </router-link>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
      @click="isMenuOpen = !isMenuOpen"
      :class="{ 'is-active': isMenuOpen }"
    >
      <div class="navbar-start">
        <router-link to="/" class="navbar-item" exact-active-class="is-active" exact
          >Home</router-link
        >
        <router-link to="/about" class="navbar-item" exact-active-class="is-active"
          >About</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>
