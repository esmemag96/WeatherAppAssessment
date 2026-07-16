<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  REVIEW_SECTIONS,
  STITCH_NAV_SECTIONS,
  resolveStitchNavSection,
  aiCollaborationContent,
  architectureContent,
  audienceContent,
  competitorsContent,
  deploymentContent,
  designContent,
  feedbackContent,
  implementationContent,
  retrospectiveContent,
  reviewContent,
  uncertaintyContent,
} from '@/content/artifacts'
import { useArtifactsTheme, useSectionObserver } from '@/shared/composables'
import { Icon } from '@/shared/ui'
import {
  AiWorkflowTimeline,
  ArchitectureExplorer,
  ArchitectureDiagram,
  CompetitorCard,
  EngineeringHero,
  EngineeringSidebar,
  EngineeringTopBar,
  CoherentAttribution,
  MilestoneGrid,
  RetrospectiveColumns,
  SectionHeader,
  Timeline,
  WorkflowFlowDiagram,
} from '@/shared/components/engineering-review'

const sectionIds = REVIEW_SECTIONS.map((s) => s.id)
const { activeSection, observe } = useSectionObserver(sectionIds)
const { isDark, toggle } = useArtifactsTheme()

const activeTimelineStep = ref(uncertaintyContent.steps[0]!.id)
const activeArchLayer = ref(architectureContent.layers[0]!.id)
const activeAiStage = ref(aiCollaborationContent.workflow[0]!.id)
const mobileNavOpen = ref(false)

const progress = computed(() => {
  const index = STITCH_NAV_SECTIONS.findIndex((s) => s.id === activeNavSection.value)
  if (index < 0) return 0
  return Math.round(((index + 1) / STITCH_NAV_SECTIONS.length) * 100)
})

const activeNavSection = computed(() => resolveStitchNavSection(activeSection.value))

watch(
  isDark,
  (dark) => {
    document.documentElement.classList.toggle('artifacts-dark', dark)
  },
  { immediate: true },
)

watch(mobileNavOpen, (open) => {
  document.documentElement.classList.toggle('er-scroll-locked', open)
})

onMounted(() => {
  document.documentElement.classList.add('engineering-review-page')
  requestAnimationFrame(() => observe())
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove(
    'engineering-review-page',
    'artifacts-dark',
    'er-scroll-locked',
  )
})

function closeMobileNav() {
  mobileNavOpen.value = false
}

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value
}
</script>

<template>
  <div class="artifacts-root" :class="{ 'artifacts-dark': isDark }">
    <div class="er-sidebar-shell er-sidebar-shell--desktop">
      <EngineeringSidebar
        :portal-title="reviewContent.portalTitle"
        :portal-subtitle="reviewContent.portalSubtitle"
        :author="reviewContent.author"
        :author-role="reviewContent.authorRole"
        :sections="STITCH_NAV_SECTIONS"
        :active-section="activeNavSection"
        :progress="progress"
        :app-link="reviewContent.hero.links.app"
        :github-link="reviewContent.hero.links.github"
        :coherent-text="reviewContent.coherentAttribution.text"
        :coherent-logo-dark-mode="reviewContent.coherentAttribution.logos.darkMode"
        :coherent-logo-light-mode="reviewContent.coherentAttribution.logos.lightMode"
        :is-dark="isDark"
        @close="closeMobileNav"
      />
    </div>

    <div v-if="mobileNavOpen" class="md:hidden">
      <button
        type="button"
        class="er-mobile-nav-backdrop ax-focus"
        aria-label="Close navigation menu"
        @click="closeMobileNav"
      />
      <div class="er-mobile-nav-panel">
        <EngineeringSidebar
          :portal-title="reviewContent.portalTitle"
          :portal-subtitle="reviewContent.portalSubtitle"
          :author="reviewContent.author"
          :author-role="reviewContent.authorRole"
          :sections="STITCH_NAV_SECTIONS"
          :active-section="activeNavSection"
          :progress="progress"
          :app-link="reviewContent.hero.links.app"
          :github-link="reviewContent.hero.links.github"
          :coherent-text="reviewContent.coherentAttribution.text"
          :coherent-logo-dark-mode="reviewContent.coherentAttribution.logos.darkMode"
          :coherent-logo-light-mode="reviewContent.coherentAttribution.logos.lightMode"
          :is-dark="isDark"
          @close="closeMobileNav"
        />
      </div>
    </div>

    <div class="er-main">
      <EngineeringTopBar
        :breadcrumb="reviewContent.breadcrumb"
        :author-initial="reviewContent.author.charAt(0)"
        :is-dark="isDark"
        @toggle-theme="toggle"
        @toggle-mobile-nav="toggleMobileNav"
      />

      <main class="er-content">
        <EngineeringHero
          :title="reviewContent.hero.title"
          :badge="reviewContent.hero.badge"
          :description="reviewContent.hero.description"
          :app-link="reviewContent.hero.links.app"
          :github-link="reviewContent.hero.links.github"
        />

        <section id="uncertainty" class="er-section space-y-8">
          <SectionHeader :title="uncertaintyContent.title" accent="primary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ uncertaintyContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="grid gap-6 md:grid-cols-12">
            <div class="glass-card flex flex-col justify-center rounded-2xl p-8 md:col-span-7">
              <Icon name="format_quote" size="xl" class="mb-4 er-text-primary" aria-hidden="true" />
              <blockquote class="font-headline-md text-headline-md italic ax-heading">
                "{{ uncertaintyContent.quote }}"
              </blockquote>
              <p class="mt-6 font-body-lg text-body-lg leading-relaxed ax-body">
                {{ uncertaintyContent.scopeNote }}
              </p>
              <p class="mt-6 text-sm font-medium ax-heading">What I chose</p>
              <p class="mt-2 text-sm leading-relaxed ax-muted">{{ uncertaintyContent.whatIChose }}</p>
            </div>
            <div
              class="glass-card rounded-2xl border-l-4 p-8 md:col-span-5"
              style="border-left-color: var(--er-error)"
            >
              <h4 class="font-title-lg text-title-lg mb-4 flex items-center gap-2 er-text-error">
                <Icon name="do_not_disturb_on" size="md" aria-hidden="true" />
                Removed Complexity
              </h4>
              <ul class="space-y-3">
                <li
                  v-for="item in uncertaintyContent.removedFromScope"
                  :key="item"
                  class="flex items-center gap-3 ax-muted"
                >
                  <span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--er-error)" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <Timeline
              :steps="uncertaintyContent.steps"
              :active-id="activeTimelineStep"
              @select="activeTimelineStep = $event"
            />
          </div>
        </section>

        <section id="audience" class="er-section space-y-8">
          <SectionHeader :title="audienceContent.title" accent="secondary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ audienceContent.framing }}
            </p>
          </SectionHeader>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="glass-card rounded-2xl p-6">
              <div class="er-persona-visual mb-6 rounded-xl">
                <img
                  :src="audienceContent.persona.image"
                  :alt="audienceContent.persona.imageAlt ?? `${audienceContent.persona.name} persona`"
                  class="er-persona-visual__image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h4 class="font-title-lg text-title-lg ax-heading">{{ audienceContent.persona.name }}</h4>
              <p class="text-sm ax-muted">
                {{ audienceContent.persona.age }} · {{ audienceContent.persona.occupation }}
              </p>
              <p class="mt-4 text-body-md text-body-md ax-body">{{ audienceContent.intro }}</p>
              <div class="ax-panel-emerald mt-5 px-4 py-3">
                <p class="ax-emerald-heading text-xs">Main goal</p>
                <p class="mt-1 text-sm ax-body">{{ audienceContent.persona.mainGoal }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2">
              <div
                v-for="trait in audienceContent.appShouldFeel"
                :key="trait.label"
                class="glass-card er-trait-card"
              >
                <Icon :name="trait.icon" size="xl" class="mb-4 er-text-primary" filled aria-hidden="true" />
                <h5 class="font-title-lg text-title-lg ax-heading">{{ trait.label }}</h5>
                <p class="mt-2 text-body-md text-body-md ax-muted">{{ trait.description }}</p>
              </div>

              <div class="glass-card p-6 md:col-span-2">
                <h5 class="font-title-lg text-title-lg mb-4 ax-heading">Uses the app</h5>
                <ul class="grid gap-2 sm:grid-cols-2">
                  <li
                    v-for="moment in audienceContent.persona.usesAppWhen"
                    :key="moment"
                    class="flex gap-2 text-sm ax-muted"
                  >
                    <Icon name="check" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
                    <span>{{ moment }}</span>
                  </li>
                </ul>
                <p class="mt-4 text-sm ax-muted">{{ audienceContent.deviceNote }}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="competitors" class="er-section space-y-8">
          <SectionHeader :title="competitorsContent.title" accent="tertiary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ competitorsContent.framing }}
            </p>
          </SectionHeader>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="ax-panel-emerald p-5">
              <h3 class="ax-emerald-heading">What I kept</h3>
              <ul class="mt-3 space-y-1.5">
                <li v-for="item in competitorsContent.kept" :key="item" class="flex gap-2 text-sm ax-muted">
                  <Icon name="check" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="glass-card p-5">
              <h3 class="ax-label er-text-error">What I left out</h3>
              <ul class="mt-3 space-y-1.5">
                <li v-for="item in competitorsContent.leftOut" :key="item" class="flex gap-2 text-sm ax-muted">
                  <Icon name="close" size="sm" class="mt-0.5 shrink-0 ax-faint" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex gap-4 overflow-x-auto pb-2">
            <CompetitorCard v-for="c in competitorsContent.competitors" :key="c.id" :competitor="c" />
          </div>
        </section>

        <section id="ai-collaboration" class="er-section space-y-8">
          <SectionHeader :title="aiCollaborationContent.title" accent="primary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ aiCollaborationContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <p class="max-w-3xl text-sm leading-relaxed ax-muted">
              {{ aiCollaborationContent.philosophy.paragraphs[0] }}
            </p>

            <div class="mt-8">
              <h3 class="ax-label mb-3">Tools used across the workflow</h3>
              <ul class="er-tool-links">
                <li v-for="tool in aiCollaborationContent.tools" :key="tool.name">
                  <a
                    :href="tool.url"
                    class="er-tool-link ax-focus"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span class="er-tool-link__name">{{ tool.name }}</span>
                    <span class="er-tool-link__role">{{ tool.role }}</span>
                    <span class="er-tool-link__arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="mt-8">
              <AiWorkflowTimeline
                :stages="aiCollaborationContent.workflow"
                :active-id="activeAiStage"
                @select="activeAiStage = $event"
              />
            </div>
            <p
              class="mt-8 max-w-3xl border-l-2 pl-4 text-sm leading-relaxed ax-body"
              style="border-color: var(--er-secondary)"
            >
              {{ aiCollaborationContent.principle }}
            </p>
          </div>
        </section>

        <section id="architecture" class="er-section space-y-8">
          <SectionHeader :title="architectureContent.title" accent="tertiary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ architectureContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <p class="ax-label mb-2">Goal</p>
            <p class="font-headline-md text-headline-md ax-heading">{{ architectureContent.goal }}</p>
          </div>

          <ArchitectureDiagram
            :diagram="architectureContent.diagram"
            :caption="architectureContent.diagramCaption"
          />

          <div class="glass-card relative overflow-hidden rounded-2xl p-8">
            <Icon
              name="layers"
              size="2xl"
              class="pointer-events-none absolute right-8 top-8 opacity-10"
              aria-hidden="true"
            />
            <h4 class="font-headline-md text-headline-md mb-2 ax-heading">4-Layer Architecture</h4>
            <p class="mb-6 max-w-3xl text-sm ax-muted">{{ architectureContent.principle }}</p>
            <div class="er-layer-grid mb-8">
              <div
                v-for="(layer, index) in architectureContent.layers"
                :key="layer.id"
                class="er-layer-card"
              >
                <span
                  class="ax-label mb-2 block"
                  :class="{
                    'er-text-primary': index === 0,
                    'er-text-secondary': index === 1,
                    'er-text-tertiary': index === 2,
                  }"
                >
                  Layer {{ String(index + 1).padStart(2, '0') }}
                </span>
                <p class="mb-1 font-bold ax-heading">{{ layer.label }}</p>
                <p class="text-xs ax-muted">{{ layer.responsibility }}</p>
              </div>
            </div>
            <ArchitectureExplorer
              :flow="architectureContent.simplifiedFlow"
              :layers="architectureContent.layers"
              :principle="architectureContent.principle"
              :active-id="activeArchLayer"
              @select-layer="activeArchLayer = $event"
            />
          </div>

          <div class="glass-card p-5">
            <h3 class="ax-label">
              Questions
              <a
                :href="architectureContent.diagramToolUrl"
                class="er-inline-tool-link"
                target="_blank"
                rel="noopener noreferrer"
              >{{ architectureContent.diagramTool }}</a>
              helped answer
            </h3>
            <ul class="mt-3 space-y-1.5">
              <li
                v-for="question in architectureContent.eraserQuestions"
                :key="question"
                class="text-sm ax-muted"
              >
                {{ question }}
              </li>
            </ul>
          </div>
        </section>

        <section id="design" class="er-section space-y-8">
          <SectionHeader :title="designContent.title" accent="secondary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ designContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="glass-card mb-2 p-5">
            <p class="text-sm ax-muted">
              Tool:
              <a
                :href="designContent.toolUrl"
                class="er-inline-tool-link font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >{{ designContent.tool }}</a>
            </p>
            <h3 class="ax-label mt-4">What the mockups helped define</h3>
            <ul class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <li
                v-for="area in designContent.definedAreas"
                :key="area"
                class="flex gap-2 text-sm ax-muted"
              >
                <Icon name="palette" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
                <span>{{ area }}</span>
              </li>
            </ul>
          </div>

          <div class="ax-panel-emerald p-5">
            <h3 class="ax-emerald-heading">Condition-based hero imagery</h3>
            <p class="mt-2 text-sm ax-muted">{{ designContent.heroImagery.intro }}</p>
            <p class="mt-3 text-sm ax-body">{{ designContent.heroImagery.decision }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="condition in designContent.heroImagery.conditions" :key="condition" class="ax-chip">
                {{ condition }}
              </span>
            </div>
          </div>
        </section>

        <section id="implementation" class="er-section space-y-8">
          <SectionHeader :title="implementationContent.title" accent="neutral">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ implementationContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="glass-card rounded-2xl p-6 sm:p-8">
            <p class="mb-2 text-sm ax-muted">
              Tool:
              <a
                :href="implementationContent.toolUrl"
                class="er-inline-tool-link font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >{{ implementationContent.tool }}</a>
            </p>
            <p class="mb-6 font-body-lg text-body-lg leading-relaxed ax-body">
              {{ implementationContent.approach }}
            </p>
            <MilestoneGrid :items="implementationContent.items" />
          </div>
        </section>

        <section id="deployment" class="er-section space-y-8">
          <SectionHeader :title="deploymentContent.title" accent="secondary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ deploymentContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="ax-panel-emerald p-5">
            <h3 class="ax-emerald-heading mb-2">
              Why
              <a
                :href="deploymentContent.platformUrl"
                class="er-inline-tool-link"
                target="_blank"
                rel="noopener noreferrer"
              >{{ deploymentContent.platform }}</a>?
            </h3>
            <p class="text-sm leading-relaxed ax-muted">{{ deploymentContent.whyVercel }}</p>
            <p class="mt-3 text-sm ax-body">{{ deploymentContent.decision }}</p>
          </div>

          <WorkflowFlowDiagram
            :steps="deploymentContent.pipeline"
            :caption="deploymentContent.pipelineCaption"
          />

          <div class="glass-card p-5">
            <h3 class="ax-emerald-heading mb-3">Key advantages</h3>
            <ul class="grid gap-2 sm:grid-cols-2">
              <li
                v-for="item in deploymentContent.advantages"
                :key="item"
                class="flex gap-2 text-sm ax-muted"
              >
                <Icon name="rocket_launch" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="mt-4 text-sm ax-body">{{ deploymentContent.outcome }}</p>
          </div>
        </section>

        <section id="feedback" class="er-section space-y-8">
          <SectionHeader :title="feedbackContent.title" accent="primary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ feedbackContent.subtitle }}
            </p>
          </SectionHeader>

          <ul class="space-y-3">
            <li
              v-for="question in feedbackContent.questions"
              :key="question"
              class="glass-card flex gap-3 p-4 text-sm ax-muted"
            >
              <Icon name="forum" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
              <span>{{ question }}</span>
            </li>
          </ul>
          <p class="text-sm ax-body">{{ feedbackContent.outcome }}</p>
        </section>

        <section id="retrospective" class="er-section space-y-8">
          <SectionHeader :title="retrospectiveContent.title" accent="tertiary">
            <p class="max-w-3xl font-body-lg text-body-lg leading-relaxed ax-body">
              {{ retrospectiveContent.subtitle }}
            </p>
          </SectionHeader>

          <div class="glass-card p-5">
            <h3 class="text-base font-semibold ax-heading">{{ retrospectiveContent.whyPageExists.title }}</h3>
            <p class="mt-2 text-sm ax-muted">{{ retrospectiveContent.intro }}</p>
            <p
              v-for="(paragraph, index) in retrospectiveContent.whyPageExists.paragraphs"
              :key="index"
              class="mt-3 text-sm leading-relaxed ax-body"
            >
              {{ paragraph }}
            </p>
          </div>

          <RetrospectiveColumns
            :worked-well="retrospectiveContent.workedWell"
            :would-improve="retrospectiveContent.wouldImprove"
            :would-do-next="retrospectiveContent.wouldDoNext"
          />

          <div class="er-closing-card glass-card mx-auto max-w-xl text-center">
            <div>
              <p class="font-bold ax-heading">{{ reviewContent.author }}</p>
              <p class="text-xs uppercase tracking-widest ax-muted">{{ reviewContent.authorRole }}</p>
            </div>
            <p class="text-sm leading-relaxed ax-body">{{ retrospectiveContent.closingMessage }}</p>
          </div>
        </section>

        <footer class="border-t py-8" style="border-color: var(--er-sidebar-border)">
          <CoherentAttribution
            :text="reviewContent.coherentAttribution.text"
            :logo-dark-mode="reviewContent.coherentAttribution.logos.darkMode"
            :logo-light-mode="reviewContent.coherentAttribution.logos.lightMode"
            :is-dark="isDark"
          />
          <p class="mt-6 text-center text-xs opacity-50 ax-muted">
            © {{ new Date().getFullYear() }} {{ reviewContent.portalTitle }}. Built with precision.
          </p>
        </footer>
      </main>
    </div>
  </div>
</template>
