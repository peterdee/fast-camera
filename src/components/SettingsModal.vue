<script setup lang="ts">
import { reactive } from 'vue';

import SwitchComponent from './Switch.vue';

const emit = defineEmits(['close-modal']);

const props = defineProps<{
  flipImage: boolean;
  threshold: number;
  useNMS: boolean;
}>();

const state = reactive<{ isClosing: boolean }>({
  isClosing: false,
});

const handleCloseModal = (): void => {
  state.isClosing = true;
  setTimeout((): void => emit('close-modal'), 160);
};
</script>

<template>
  <div
    :class="`f ai-center ns modal ${state.isClosing
      ? 'modal-closing'
      : ''}`"
  >
    <div class="f d-col mh-auto content">
      <div class="t-center title">
        FAST corner detector demo
      </div>
      <SwitchComponent
        label="Flip image"
        :is-checked="props.flipImage"
        @toggle-switch="$emit('toggle-flip')"
      />
      <SwitchComponent
        label="Use NMS"
        :is-checked="props.useNMS"
        @toggle-switch="$emit('toggle-nms')"
      />
      <div class="mt-1 divider"></div>
      <div class="f d-col mt-1">
        <span class="t-center">
          FAST threshold
        </span>
        <div class="f ai-center j-space-between mt-1">
          <span class="t-left threshold">
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
          <span class="t-right threshold">
            255
          </span>
        </div>
        <div class="f mh-auto j-center">
          <span class="mt-half t-center threshold">
            {{ props.threshold }}
          </span>
        </div>
      </div>
      <button
        class="mt-2 button close-button"
        @click="handleCloseModal"
      >
        CLOSE
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes disappear {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.close-button {
  color: var(--text);
}
.content {
  max-width: calc(var(--spacer) * 25);
  min-width: calc(var(--spacer) * 15);
  width: 30%;
}
.divider {
  background-color: var(--text-inverted);
  width: 100%;
  height: calc(var(--spacer-quarter) / 4);
}
.modal {
  animation: appear var(--transition) ease-in;
  background-color: rgba(0, 0, 0, .7);
  color: var(--text-inverted);
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: 10;
}
.modal-closing {
  animation: disappear var(--transition) ease-out;
}
.threshold {
  width: calc(var(--spacer) * 3);
}
.title {
  color: var(--accent);
  font-size: calc(var(--spacer) + var(--spacer-half));
  font-weight: 300;
}
input[type=range] {
  appearance: none;
  background-color: transparent;
  width: calc(100% - var(--spacer) * 5);
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: var(--text-inverted);
  border-radius: var(--spacer-half);
  cursor: pointer;
  height: calc(var(--spacer) - var(--spacer-quarter));
  width: 100%;
}
input[type=range]::-webkit-slider-thumb {
  background: var(--accent);
  border-radius: var(--spacer-quarter);
  cursor: pointer;
  height: var(--spacer);
  margin-top: calc(var(--spacer-quarter) / 2 * -1);
  width: calc(var(--spacer) - var(--spacer-quarter));
  -webkit-appearance: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: var(--text-inverted);
}
input[type=range]::-moz-range-track {
  background: var(--text-inverted);
  border-radius: var(--spacer-half);
  cursor: pointer;
  height: calc(var(--spacer) - var(--spacer-quarter));
  width: 100%;
}
input[type=range]::-moz-range-thumb {
  background: var(--accent);
  border-radius: var(--spacer-quarter);
  cursor: pointer;
  height: var(--spacer);
  width: calc(var(--spacer) - var(--spacer-quarter));
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  color: transparent;
  cursor: pointer;
  height: calc(var(--spacer) - var(--spacer-quarter));
  width: 100%;
}
input[type=range]::-ms-fill-lower,
input[type=range]::-ms-fill-upper {
  background: var(--text-inverted);
  border-radius: var(--spacer);
}
input[type=range]::-ms-thumb {
  background: var(--accent);
  border-radius: var(--spacer-quarter);
  cursor: pointer;
  height: var(--spacer);
  width: calc(var(--spacer) - var(--spacer-quarter));
}
input[type=range]:focus::-ms-fill-lower,
input[type=range]:focus::-ms-fill-upper {
  background: var(--text-inverted);
}
</style>
