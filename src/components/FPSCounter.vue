<script setup lang="ts">
const props = defineProps<{ count: number }>();
</script>

<template>
  <div class="f ai-center j-space-between ns counter">
    <span>
      FPS:
    </span>
    <span>
      {{ props.count }}
    </span>
  </div>
</template>

<style scoped>
.counter {
  background-color: rgba(0, 0, 0, .7);
  border-radius: var(--spacer);
  color: var(--text-inverted);
  height: calc(var(--spacer) * 2);
  left: var(--spacer);
  opacity: .5;
  padding: 0 var(--spacer);
  position: fixed;
  top: var(--spacer);
  transition: opacity var(--transition) ease-out;
  width: calc(var(--spacer) * 6);
  z-index: 10;
}
.counter:hover {
  opacity: 1;
  transition: opacity var(--transition) ease-in;
}
</style>
