<script setup lang="ts">
const props = defineProps<{
  isMobile: boolean;
}>()

const year = new Date().getFullYear();
</script>

<template>
  <div class="f ai-center fade-in ns modal">
    <div :class="`f d-col j-space-between mh-auto ${!isMobile ? 'wrap' : 'wrap-mobile'}`">
      <div class="empty"></div>
      <div
        :class="`f d-col ${props.isMobile
          ? 'p-2 content-mobile'
          : 'mh-2 content'}`"
      >
        <div class="t-center title">
          Could not access the camera!
        </div>
        <div class="mt-2 t-center text">
          This application requires an access to your camera!
        </div>
        <div class="mt-1 t-center text">
          Please connect your camera and refresh this page to use this application.
        </div>
      </div>
      <div class="f ai-center j-center footer">
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
    </div>
  </div>
</template>

<style scoped>
.empty {
  height: var(--spacer-quarter);
}
.footer {
  height: calc(var(--spacer) * 4);
}
.logo {
  height: var(--spacer);
}
.text {
  color: var(--text-inverted);
  font-size: calc(var(--spacer) + var(--spacer-quarter));
}
.title {
  color: var(--error);
  font-size: calc(var(--spacer) + var(--spacer-half));
  font-weight: 400;
}
.wrap {
  height: 100vh;
}
.wrap-mobile {
  height: fill-available;
  height: -webkit-fill-available;
}
</style>
