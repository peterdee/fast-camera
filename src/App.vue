<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import checkMobile from './utilities/is-mobile'

interface ComponentState {
  ctx: CanvasRenderingContext2D | null;
  flipImage: boolean;
  fpsCount: number;
  frameTime: number[];
  isMobile: boolean;
  showErrorModal: boolean;
  showOptionsModal: boolean;
  wasmLoaded: boolean;
}

const state = reactive<ComponentState>({
  ctx: null,
  flipImage: false,
  fpsCount: 0,
  frameTime: [],
  isMobile: false,
  showErrorModal: false,
  showOptionsModal: false,
  wasmLoaded: false,
});

const canvasRef = ref<HTMLCanvasElement>();

onMounted(async (): Promise<void> => {
  const isMobile = checkMobile()
  if (isMobile) {
    state.isMobile = true;
  }
});
</script>

<template>
  <div
    class="f ai-center j-center wrap"
  >
    <canvas
      ref="canvasRef"
    ></canvas>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
}
</style>
