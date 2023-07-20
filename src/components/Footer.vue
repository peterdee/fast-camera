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
      class="mh-half"
      href="https://dyum.in"
      target="_blank"
    >
      Peter Dyumin
    </a>
    ©
    <span class="ml-half">
      {{ year }}
    </span>
  </div>
</template>

<style scoped>
.footer {
  background-color: rgba(0, 0, 0, .7);
  border-radius: var(--spacer);
  bottom: var(--spacer);
  color: var(--text-inverted);
  height: calc(var(--spacer) * 2);
  opacity: .5;
  padding: 0 var(--spacer);
  position: fixed;
  transition: opacity var(--transition) ease-out;
  z-index: 10;
}
.footer:hover {
  opacity: 1;
  transition: opacity var(--transition) ease-in;
}
.logo {
  height: calc(var(--spacer));
}
</style>
