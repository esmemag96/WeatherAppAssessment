<!--
  WeatherAnimationOverlay
  -----------------------
  Purpose:
    Subtle, decorative motion layer for `WeatherHeroCard`'s background,
    driven by the same `WeatherVisual` already used to pick the hero
    photo (see `resolveWeatherVisual`) - falling rain/snow, drifting fog
    or clouds, a heat shimmer, night stars, or a lightning flash for
    storms. Pure CSS keyframes over a handful of absolutely-positioned
    particles (see `buildWeatherParticles`) - no animation library, no
    canvas, so the bundle/runtime cost stays negligible.

    `visual` only reflects the CURRENT observation, but
    `resolveWeatherAlerts` looks at today's forecasted extremes - so a
    day that's cloudy right now but heading for a 32C afternoon shows a
    "High Temperature Advisory" while the sky outside is still just
    cloudy. Rather than let the animation contradict that advisory (or
    lie about the current photo by swapping it to a "hot" scene), active
    `alertKinds` LAYER their effect on top of whatever `visual` already
    renders - e.g. a heat advisory adds the heat-shimmer waves alongside
    the drifting clouds, instead of replacing them.

    Renders nothing when the user prefers reduced motion
    (`useReducedMotion`) - this layer is decorative only, never carries
    information the rest of the hero doesn't already show.

  Props:
    - visual (WeatherVisual, required).
    - alertKinds (WeatherAlertKind[], default []): kinds of any
      currently-active advisories (see `resolveWeatherAlerts`) - layers
      extra effects (heat shimmer, snow, rain, lightning, wind streaks)
      on top of `visual`'s own animation.

  Slots/Events: none.

  Usage:
    <WeatherAnimationOverlay visual="cloudy" :alert-kinds="['heat']" />
-->
<script setup lang="ts">
import { computed } from 'vue'

import type { WeatherAlertKind } from '@/entities/weather'
import type { WeatherVisual } from '@/infrastructure/images'
import { useReducedMotion } from '@/shared/composables'
import { buildWeatherParticles } from '@/shared/utils'

const props = withDefaults(defineProps<{ visual: WeatherVisual; alertKinds?: WeatherAlertKind[] }>(), {
  alertKinds: () => [],
})

const prefersReducedMotion = useReducedMotion()

const hasAlert = (kind: WeatherAlertKind) => props.alertKinds.includes(kind)

const showRain = computed(
  () => props.visual === 'rain' || props.visual === 'storm' || hasAlert('rain') || hasAlert('storm'),
)
const showSnow = computed(() => props.visual === 'snow' || props.visual === 'cold' || hasAlert('cold'))
const showFog = computed(() => props.visual === 'fog')
const showClouds = computed(() => props.visual === 'cloudy' || props.visual === 'partly-cloudy')
const showHeatShimmer = computed(() => props.visual === 'hot' || hasAlert('heat'))
const showStars = computed(() => props.visual === 'night')
const showSparkle = computed(() => props.visual === 'clear')
const showLightning = computed(() => props.visual === 'storm' || hasAlert('storm'))
const showWind = computed(() => hasAlert('wind'))

const rainDrops = computed(() =>
  showRain.value ? buildWeatherParticles(28, { durationSeconds: [0.6, 1.1], driftPx: [-6, 6] }, 11) : [],
)
const snowFlakes = computed(() =>
  showSnow.value ? buildWeatherParticles(22, { durationSeconds: [4, 8], driftPx: [-40, 40] }, 22) : [],
)
const fogBands = computed(() => (showFog.value ? buildWeatherParticles(3, { durationSeconds: [10, 16], driftPx: [-40, 40] }, 33) : []))
const clouds = computed(() => (showClouds.value ? buildWeatherParticles(3, { durationSeconds: [22, 34], driftPx: [-30, 30] }, 44) : []))
const heatWaves = computed(() => (showHeatShimmer.value ? buildWeatherParticles(4, { durationSeconds: [3, 5], driftPx: [-10, 10] }, 55) : []))
const stars = computed(() => (showStars.value ? buildWeatherParticles(18, { durationSeconds: [2, 4.5], driftPx: [0, 0] }, 66) : []))
const sparkles = computed(() => (showSparkle.value ? buildWeatherParticles(6, { durationSeconds: [3, 5], driftPx: [0, 0] }, 77) : []))
const windStreaks = computed(() =>
  showWind.value ? buildWeatherParticles(10, { durationSeconds: [1, 1.8], driftPx: [0, 0] }, 88) : [],
)
</script>

<template>
  <div v-if="!prefersReducedMotion" class="wx-overlay pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <span
      v-for="drop in rainDrops"
      :key="`rain-${drop.id}`"
      class="wx-rain-drop"
      :style="{
        left: `${drop.leftPercent}%`,
        animationDuration: `${drop.durationSeconds}s`,
        animationDelay: `${drop.delaySeconds}s`,
        transform: `scaleY(${drop.scale})`,
        '--wx-drift': `${drop.driftPx}px`,
      }"
    />

    <span
      v-for="flake in snowFlakes"
      :key="`snow-${flake.id}`"
      class="wx-snowflake"
      :style="{
        left: `${flake.leftPercent}%`,
        width: `${4 * flake.scale}px`,
        height: `${4 * flake.scale}px`,
        animationDuration: `${flake.durationSeconds}s`,
        animationDelay: `${flake.delaySeconds}s`,
        '--wx-drift': `${flake.driftPx}px`,
      }"
    />

    <span
      v-for="band in fogBands"
      :key="`fog-${band.id}`"
      class="wx-fog-band"
      :style="{
        top: `${18 + band.id * 28}%`,
        animationDuration: `${band.durationSeconds}s`,
        animationDelay: `${band.delaySeconds}s`,
      }"
    />

    <span
      v-for="cloud in clouds"
      :key="`cloud-${cloud.id}`"
      class="material-symbols-outlined wx-cloud"
      :style="{
        top: `${10 + cloud.id * 22}%`,
        fontSize: `${52 * cloud.scale}px`,
        opacity: 0.55 + cloud.scale * 0.15,
        animationDuration: `${cloud.durationSeconds}s`,
        animationDelay: `${cloud.delaySeconds}s`,
        fontVariationSettings: `'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 48`,
      }"
      >cloud</span
    >

    <span
      v-for="wave in heatWaves"
      :key="`heat-${wave.id}`"
      class="wx-heat-wave"
      :style="{
        left: `${wave.leftPercent}%`,
        animationDuration: `${wave.durationSeconds}s`,
        animationDelay: `${wave.delaySeconds}s`,
      }"
    />

    <span
      v-for="star in stars"
      :key="`star-${star.id}`"
      class="wx-star"
      :style="{
        left: `${star.leftPercent}%`,
        top: `${(star.id * 37) % 60}%`,
        animationDuration: `${star.durationSeconds}s`,
        animationDelay: `${star.delaySeconds}s`,
      }"
    />

    <span
      v-for="sparkle in sparkles"
      :key="`sparkle-${sparkle.id}`"
      class="wx-sparkle"
      :style="{
        left: `${sparkle.leftPercent}%`,
        top: `${10 + (sparkle.id * 13) % 30}%`,
        animationDuration: `${sparkle.durationSeconds}s`,
        animationDelay: `${sparkle.delaySeconds}s`,
      }"
    />

    <span v-if="showLightning" class="wx-lightning wx-lightning--a" />
    <span v-if="showLightning" class="wx-lightning wx-lightning--b" />

    <span
      v-for="streak in windStreaks"
      :key="`wind-${streak.id}`"
      class="wx-wind-streak"
      :style="{
        top: `${(streak.id * 23) % 90}%`,
        width: `${40 + streak.scale * 30}px`,
        animationDuration: `${streak.durationSeconds}s`,
        animationDelay: `${streak.delaySeconds}s`,
      }"
    />
  </div>
</template>

<style scoped>
.wx-overlay {
  contain: strict;
}

/* Rain */
.wx-rain-drop {
  position: absolute;
  top: -24px;
  width: 2px;
  height: 16px;
  border-radius: 999px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.55));
  animation-name: wx-fall-rain;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes wx-fall-rain {
  from {
    transform: translate(0, 0);
    opacity: 0.9;
  }
  to {
    transform: translate(var(--wx-drift, 0), 460px);
    opacity: 0.4;
  }
}

/* Snow */
.wx-snowflake {
  position: absolute;
  top: -12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  animation-name: wx-fall-snow;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes wx-fall-snow {
  from {
    transform: translate(0, 0);
    opacity: 0.9;
  }
  to {
    transform: translate(var(--wx-drift, 0), 440px);
    opacity: 0.3;
  }
}

/* Fog */
.wx-fog-band {
  position: absolute;
  left: -20%;
  width: 140%;
  height: 46px;
  border-radius: 999px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.45), transparent);
  filter: blur(6px);
  animation-name: wx-drift-fog;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes wx-drift-fog {
  from {
    transform: translateX(-8%);
  }
  to {
    transform: translateX(8%);
  }
}

/* Clouds - an actual "cloud" glyph (same icon set as the rest of the app)
   reads as a cloud immediately, instead of a blurred blob that only ever
   looked like a smudge. `left` starts off-screen and a `transform:
   translateX(%)` is relative to the element's OWN box, not the container -
   a small percentage there was never enough to cross a wide hero, so this
   uses `vw` (viewport-relative) to comfortably clear the hero's width
   (max 72rem) regardless of screen size. */
.wx-cloud {
  position: absolute;
  left: -15%;
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
  animation-name: wx-drift-cloud;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes wx-drift-cloud {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(160vw);
  }
}

/* Heat shimmer */
.wx-heat-wave {
  position: absolute;
  bottom: -10%;
  width: 40%;
  height: 55%;
  border-radius: 999px;
  background: radial-gradient(closest-side, rgba(255, 200, 120, 0.55), transparent);
  filter: blur(14px);
  transform: translateX(-50%);
  animation-name: wx-heat-rise;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes wx-heat-rise {
  0%,
  100% {
    opacity: 0.35;
    transform: translate(-50%, 0) scale(0.9);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -8%) scale(1.05);
  }
}

/* Night stars */
.wx-star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  animation-name: wx-twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes wx-twinkle {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.9;
  }
}

/* Clear-day sparkle */
.wx-sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  animation-name: wx-twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* Lightning */
.wx-lightning {
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.wx-lightning--a {
  animation-name: wx-flash;
  animation-duration: 6.5s;
}

.wx-lightning--b {
  animation-name: wx-flash;
  animation-duration: 9.2s;
  animation-delay: -3s;
}

@keyframes wx-flash {
  0%,
  95% {
    opacity: 0;
  }
  96% {
    opacity: 0.55;
  }
  97% {
    opacity: 0.05;
  }
  98% {
    opacity: 0.35;
  }
  100% {
    opacity: 0;
  }
}

/* Wind advisory - fast horizontal speed-lines layered on top of whatever `visual` already draws. */
.wx-wind-streak {
  position: absolute;
  left: -15%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation-name: wx-blow-wind;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes wx-blow-wind {
  from {
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  to {
    transform: translateX(160vw);
    opacity: 0;
  }
}
</style>
