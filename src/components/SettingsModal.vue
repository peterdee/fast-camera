<script setup lang="ts">
import { reactive } from 'vue';

import SwitchComponent from './Switch.vue';

const emit = defineEmits([
  'close-modal',
  'handle-nms-radius',
  'handle-threshold',
  'toggle-flip',
  'toggle-nms',
  'toggle-wasm',
]);

const props = defineProps<{
  flipImage: boolean;
  isMobile: boolean;
  nmsRadius: number;
  threshold: number;
  useNMS: boolean;
  useWASM: boolean;
  wasmLoaded: boolean;
}>();

const state = reactive<{ isClosing: boolean }>({
  isClosing: false,
});

const handleCloseModal = (): void => {
  state.isClosing = true;
  setTimeout((): void => emit('close-modal'), 240);
};
</script>

<template>
  <div
    :class="`f ai-center fade-in ns modal ${state.isClosing
      ? 'fade-out'
      : ''}`"
  >
    <div
      :class="`f d-col mh-auto ${props.isMobile
        ? 'content-mobile p-2'
        : 'content'}`"
    >
      <div :class="`mb-2 t-center ${props.isMobile ? 'title-mobile' : 'title'}`">
        FAST corner detector demo
      </div>
      <SwitchComponent
        label="Flip image"
        name="flip"
        :disabled="false"
        :is-checked="props.flipImage"
        @toggle-switch="emit('toggle-flip')"
      />
      <div
        :class="`mt-1 ${!props.wasmLoaded
          ? 'transparency-high'
          : 'transparency-low'}`"
      >
        <SwitchComponent
          label="Use WASM"
          name="wasm"
          :disabled="!props.wasmLoaded"
          :is-checked="props.useWASM"
          @toggle-switch="emit('toggle-wasm')"
        />
      </div>
      <div class="mv-1 divider"></div>
      <SwitchComponent
        label="Use NMS"
        name="nms"
        :disabled="false"
        :is-checked="props.useNMS"
        @toggle-switch="emit('toggle-nms')"
      />
      <div
        :class="`f d-col mt-1 ${!props.useNMS
          ? 'transparency-high'
          : 'transparency-low'}`"
      >
        <span class="t-center">
          NMS radius
        </span>
        <div class="f ai-center j-center mt-1 w-100">
          <input
            max="25"
            min="1"
            step="1"
            type="range"
            :disabled="!useNMS"
            :value="props.nmsRadius"
            @input="emit('handle-nms-radius', $event)"
          />
        </div>
        <div class="f mh-auto j-center">
          <span class="mt-half t-center threshold">
            {{ props.nmsRadius }}
          </span>
        </div>
      </div>
      <div class="mt-1 divider"></div>
      <div class="f d-col mt-1">
        <span class="t-center">
          FAST threshold
        </span>
        <div class="f ai-center j-center mt-1 w-100">
          <input
            max="255"
            min="1"
            step="1"
            type="range"
            :value="props.threshold"
            @input="emit('handle-threshold', $event)"
          />
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
.close-button {
  border-radius: var(--spacer-half);
  color: var(--text);
  height: calc(var(--spacer) * 2 + var(--spacer-half));
}
.close-button:hover {
  background-color: var(--accent-light);
}
.divider {
  background-color: var(--text-inverted);
  height: calc(var(--spacer-quarter) / 4);
  opacity: .75;
  width: 100%;
}
.threshold {
  width: calc(var(--spacer) * 3);
}
.title, .title-mobile {
  color: var(--accent);
  font-weight: 300;
}
.title {
  font-size: calc(var(--spacer) + var(--spacer-half));
}
.title-mobile {
  font-size: calc(var(--spacer) + var(--spacer-quarter));
}
.transparency-high {
  opacity: .3;
  transition: opacity var(--transition) ease-in;
}
.transparency-low {
  opacity: 1;
  transition: opacity var(--transition) ease-out;
}
input[type=range] {
  appearance: none;
  background-color: transparent;
  width: 100%;
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
