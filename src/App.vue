<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import checkMobile from './utilities/is-mobile';
import fast from './fast-canvas';
import FooterComponent from './components/Footer.vue';

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
  flipImage: true,
  fpsCount: 0,
  frameTime: [],
  isMobile: false,
  showErrorModal: false,
  showOptionsModal: false,
  wasmLoaded: false,
});

const canvasRef = ref<HTMLCanvasElement>();

const draw = (video: HTMLVideoElement): null | NodeJS.Timeout | void => {
  const { ctx } = state;
  if (!ctx) {
    return null;
  }

  ctx.drawImage(video, 0, 0);
  state.frameTime.push(Date.now());
  if (state.frameTime.length === 10) {
    const diff = state.frameTime[9] - state.frameTime[0];
    state.fpsCount = Math.round(10000 / diff);
    state.frameTime = [];
  }

  let canvasHeight = window.innerHeight;
  let canvasWidth = window.innerWidth;
  if (canvasRef.value) {
    canvasHeight = canvasRef.value.height;
    canvasWidth = canvasRef.value.width;
  }

  const imageData = ((): ImageData => {
    const frame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    return fast({
      imageData: frame,
      radius: 40,
      threshold: 40,
    });
  })();

  ctx.putImageData(imageData, 0, 0);

  return setTimeout(draw, 10, video);
};

const handleError = (reason: unknown): void => {
  state.showErrorModal = true;
  console.log(reason);
};

const handleSuccess = (stream: MediaStream): void => {
  console.log('got stream', stream);

  const [videoTrack = null] = stream.getVideoTracks();
  if (!videoTrack) {
    state.showErrorModal = true;
    return console.log('video track is not available');
  }
  console.log('got track', videoTrack);

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let canvasHeight = windowHeight;
  let canvasWidth = windowWidth;

  // get video resolution
  const capabilities = videoTrack.getCapabilities();
  if (capabilities.height && capabilities.height.max) {
    canvasHeight = capabilities.height.max > windowHeight
      ? windowHeight
      : capabilities.height.max;
  }
  if (capabilities.width && capabilities.width.max) {
    canvasWidth = capabilities.width.max > windowWidth
      ? windowWidth
      : capabilities.width.max;
  }

  // set canvas size
  if (canvasRef.value) {
    canvasRef.value.height = canvasHeight;
    canvasRef.value.width = canvasWidth;
  }

  // adjust video track resolution for mobile devices
  if (state.isMobile) {
    videoTrack.applyConstraints({
      height: canvasWidth,
      width: canvasHeight,
    });
  }

  const video = document.createElement('video');
  video.onplay = (): null | NodeJS.Timeout | void => draw(video);
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  video.play();
};

onMounted((): void => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const faviconLink = document.querySelector<HTMLLinkElement>(`link[rel~='${'icon'}']`);
    if (faviconLink) {
      faviconLink.href = 'favicon-light.svg';
    }
  }

  const isMobile = checkMobile()
  state.isMobile = isMobile

  if (!isMobile) {
    state.flipImage = true;
  }

  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d', { willReadFrequently: true }) || null;
    if (ctx) {
      state.ctx = ctx;
    }
  }

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      height: {
        ideal: windowHeight,
        max: windowHeight,
        min: 1,
      },
      width: {
        ideal: windowWidth,
        max: windowWidth,
        min: 1,
      },
    },
  };
  if (isMobile) {
    (constraints.video as MediaTrackConstraints).facingMode = { exact: 'environment' };
  }

  navigator.mediaDevices.getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
});
</script>

<template>
  <div
    class="f ai-center j-center wrap"
  >
    <canvas
      :class="`${state.flipImage ? 'flip' : ''}`"
      ref="canvasRef"
    ></canvas>
    <FooterComponent />
  </div>
</template>

<style scoped>
.flip {
  -moz-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1);
  transform: scale(-1, 1);
}
.wrap {
  min-height: 100vh;
}
</style>