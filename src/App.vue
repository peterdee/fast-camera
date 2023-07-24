<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import checkMobile from './utilities/is-mobile';
import fast from './fast-canvas';
import FooterComponent from './components/Footer.vue';
import FPSCounterComponent from './components/FPSCounter.vue';
import { getData, setData } from './utilities/data-service';
import SettingsButtonComponent from './components/SettingsButton.vue';
import SettingsModalComponent from './components/SettingsModal.vue';

const DEFAULT_RADIUS = 10;
const DEFAULT_THRESHOLD = 40;

interface StoredSettings {
  fastThreshold: number;
  flipImage: boolean;
  nmsRadius: number;
  useNMS: boolean;
  useWASM: boolean;
}

interface ComponentState extends StoredSettings {
  ctx: CanvasRenderingContext2D | null;
  fpsCount: number;
  frameTime: number[];
  isMobile: boolean;
  showErrorModal: boolean;
  showSettingsModal: boolean;
  wasmLoaded: boolean;
}

const state = reactive<ComponentState>({
  ctx: null,
  fastThreshold: DEFAULT_THRESHOLD,
  flipImage: false,
  fpsCount: 0,
  frameTime: [],
  isMobile: false,
  nmsRadius: DEFAULT_RADIUS,
  showErrorModal: false,
  showSettingsModal: false,
  useNMS: false,
  useWASM: false,
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
      radius: state.nmsRadius,
      threshold: state.fastThreshold,
      useNMS: state.useNMS,
    });
  })();

  ctx.putImageData(imageData, 0, 0);

  return setTimeout(draw, 10, video);
};

// TODO: handle errors
const handleError = (reason: unknown): void => {
  state.showErrorModal = true;
  console.log(reason);
};

const handleSuccess = (stream: MediaStream): void => {
  const [videoTrack = null] = stream.getVideoTracks();
  if (!videoTrack) {
    // TODO: handle errors
    state.showErrorModal = true;
    return console.log('video track is not available');
  }

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let canvasHeight = windowHeight;
  let canvasWidth = windowWidth;

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

  if (canvasRef.value) {
    canvasRef.value.height = canvasHeight;
    canvasRef.value.width = canvasWidth;
  }

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

const handleNMSRadius = (event: InputEvent): void => {
  const { value } = event.target as HTMLInputElement;
  state.nmsRadius = Number(value);
  return setData<StoredSettings>(
    'settings',
    {
      fastThreshold: state.fastThreshold,
      flipImage: state.flipImage,
      nmsRadius: state.nmsRadius,
      useNMS: state.useNMS,
      useWASM: state.useWASM,
    },
  );
};

const handleThreshold = (event: InputEvent): void => {
  const { value } = event.target as HTMLInputElement;
  state.fastThreshold = Number(value);
  return setData<StoredSettings>(
    'settings',
    {
      fastThreshold: state.fastThreshold,
      flipImage: state.flipImage,
      nmsRadius: state.nmsRadius,
      useNMS: state.useNMS,
      useWASM: state.useWASM,
    },
  );
};

const toggleNMS = (): void => {
  state.useNMS = !state.useNMS;
  return setData<StoredSettings>(
    'settings',
    {
      fastThreshold: state.fastThreshold,
      flipImage: state.flipImage,
      nmsRadius: state.nmsRadius,
      useNMS: state.useNMS,
      useWASM: state.useWASM,
    },
  );
};

const toggleFlipImage = (): void => {
  state.flipImage = !state.flipImage;
  return setData<StoredSettings>(
    'settings',
    {
      fastThreshold: state.fastThreshold,
      flipImage: state.flipImage,
      nmsRadius: state.nmsRadius,
      useNMS: state.useNMS,
      useWASM: state.useWASM,
    },
  );
};

const toggleSettingsModal = (): void => {
  state.showSettingsModal = !state.showSettingsModal;
};

const toggleWASM = (): void => {
  state.useWASM = !state.useWASM;
  return setData<StoredSettings>(
    'settings',
    {
      fastThreshold: state.fastThreshold,
      flipImage: state.flipImage,
      nmsRadius: state.nmsRadius,
      useNMS: state.useNMS,
      useWASM: state.useWASM,
    },
  );
};

onMounted(async (): Promise<void> => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const faviconLink = document.querySelector<HTMLLinkElement>(`link[rel~='${'icon'}']`);
    if (faviconLink) {
      faviconLink.href = 'favicon-light.svg';
    }
  }

  const go = new (window as any).Go();
  try {
    const waInstance = await WebAssembly.instantiateStreaming(
      fetch('bin.wasm'),
      go.importObject,
    );
    go.run(waInstance.instance);
    state.wasmLoaded = true;
  } catch {
    state.wasmLoaded = false;
  }

  const existingSettings = getData<StoredSettings>('settings');
  if (existingSettings) {
    state.fastThreshold = existingSettings.fastThreshold;
    state.flipImage = existingSettings.flipImage;
    state.useNMS = existingSettings.useNMS;
    if (state.wasmLoaded) {
      state.useWASM = existingSettings.useWASM;
    }
  }

  const isMobile = checkMobile();
  state.isMobile = isMobile;

  if (!isMobile && !existingSettings) {
    state.flipImage = true;
    setData<StoredSettings>(
      'settings',
      {
        fastThreshold: DEFAULT_THRESHOLD,
        flipImage: true,
        nmsRadius: state.nmsRadius,
        useNMS: state.useNMS,
        useWASM: state.useWASM,
      },
    );
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
      facingMode: {
        ideal: 'environment',
      },
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

  navigator.mediaDevices.getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
});
</script>

<template>
  <div
    :class="`f ai-center j-center ${state.isMobile ? 'wrap-mobile' : 'wrap'}`"
  >
    <template v-if="!state.showSettingsModal">
      <FPSCounterComponent :count="state.fpsCount" />
      <SettingsButtonComponent @handle-click="toggleSettingsModal" />
    </template>
    <template v-if="state.showSettingsModal">
      <SettingsModalComponent
        :flip-image="state.flipImage"
        :is-mobile="state.isMobile"
        :nms-radius="state.nmsRadius"
        :threshold="state.fastThreshold"
        :use-n-m-s="state.useNMS"
        :use-w-a-s-m="state.useWASM"
        :wasm-loaded="state.wasmLoaded"
        @close-modal="toggleSettingsModal"
        @handle-nms-radius="handleNMSRadius"
        @handle-threshold="handleThreshold"
        @toggle-flip="toggleFlipImage"
        @toggle-nms="toggleNMS"
        @toggle-wasm="toggleWASM"
      />
    </template>
    <canvas
      :class="`${state.flipImage ? 'flip' : ''}`"
      ref="canvasRef"
    ></canvas>
    <template v-if="!state.showSettingsModal">
      <FooterComponent />
    </template>
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
  height: 100vh;
  z-index: 0;
}
.wrap-mobile {
  height: 100%;
  z-index: 0;
}
</style>
