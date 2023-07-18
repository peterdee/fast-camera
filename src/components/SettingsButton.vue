<script setup lang="ts">

</script>

<template>
  <button
    class="f ai-center settings"
    type="button"
    @click="$emit('handle-click')"
  >
    <img
      alt="Settings"
      class="icon"
      src="/cog.svg"
    />
  </button>
</template>

<style scoped>
.icon {
  height: calc(var(--spacer) * 2);
  width: calc(var(--spacer) * 2);
}
.settings {
  background-color: rgba(0, 0, 0, .6);
  border: none;
  border-radius: 50%;
  color: var(--text-inverted);
  cursor: pointer;
  opacity: .5;
  padding: var(--spacer-half);
  position: fixed;
  right: var(--spacer);
  top: var(--spacer);
  transition: opacity var(--transition) ease-out;
  z-index: 10;
}
.settings:hover {
  opacity: 1;
  transition: opacity var(--transition) ease-in;
}
</style>
