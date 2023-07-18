<script setup lang="ts">
const props = defineProps<{
  flipImage: boolean;
  threshold: number;
}>();
</script>

<template>
  <div class="f ai-center ns modal">
    <div class="f d-col mh-auto">
      <h2>
        Settings
      </h2>
      <div class="f mt-1">
        <input
          id="flip"
          type="checkbox"
          :checked="props.flipImage"
          @change="$emit('toggle-flip')"
        />
        <label for="flip">
          Flip image
        </label>
      </div>
      <div class="f d-col mt-1">
        <div class="f ai-center j-space-between">
          <span>
            1
          </span>
          <input
            max="255"
            min="1"
            step="1"
            type="range"
            :value="props.threshold"
            @input="$emit('handle-threshold', $event)"
          />
          <span>
            255
          </span>
        </div>
        <div class="f j-center">
          {{ props.threshold }}
        </div>
      </div>
      <button
        class="mt-1"
        @click="$emit('close-modal')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, .6);
  color: var(--text-inverted);
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: 10;
}
</style>
