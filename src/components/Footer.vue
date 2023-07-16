<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="f ai-center ns footer">
    <div class="logo">
      <img
        alt="Logo"
        class="logo"
        src="/favicon-light.svg"
      />
    </div>
    <a
      class="mh-1"
      href="https://dyum.in"
      target="_blank"
    >
      Peter Dyumin
    </a>
    {{ year }}
  </div>
</template>

<style scoped>
.footer {
  position: absolute;
  bottom: var(--spacer);
  border-radius: var(--spacer);
  background-color: rgba(0, 0, 0, .6);
  height: calc(var(--spacer) * 2);
  padding: 0 var(--spacer);
  color: var(--text-inverted);
}
.logo {
  height: calc(var(--spacer));
}
</style>
