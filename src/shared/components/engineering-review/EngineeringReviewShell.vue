<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import {
  REVIEW_SECTIONS,
  aiCollaborationContent,
  architectureContent,
  competitorsContent,
  decisionsContent,
  implementationContent,
  qualityContent,
  retrospectiveContent,
  reviewContent,
  tradeoffsContent,
  uncertaintyContent,
} from '@/content/artifacts'
import { useArtifactsTheme, useSectionObserver } from '@/shared/composables'
import { Icon } from '@/shared/ui'
import {
  AiLessonsLearned,
  AiPrincipleCard,
  AiToolCard,
  AiWorkflowTimeline,
  ArchitectureExplorer,
  CompetitorCard,
  DecisionCard,
  EngineeringHero,
  OwnershipMatrix,
  PhilosophyHighlight,
  QualityMetric,
  RetrospectiveColumns,
  Roadmap,
  SectionHeader,
  SectionNavigation,
  SubsectionTitle,
  Timeline,
  TradeoffCard,
  WorkflowFlowDiagram,
} from '@/shared/components/engineering-review'

const sectionIds = REVIEW_SECTIONS.map((s) => s.id)
const { activeSection, observe } = useSectionObserver(sectionIds)
const { isDark, toggle } = useArtifactsTheme()

const activeTimelineStep = ref(uncertaintyContent.steps[0]!.id)
const activeAiWorkflowStage = ref(aiCollaborationContent.workflow.stages[0]!.id)
const activeArchLayer = ref(architectureContent.layers[0]!.id)
const showFullDiagram = ref(false)

const progress = computed(() => {
  const index = REVIEW_SECTIONS.findIndex((s) => s.id === activeSection.value)
  if (index < 0) return 0
  return Math.round(((index + 1) / REVIEW_SECTIONS.length) * 100)
})

onMounted(() => {
  requestAnimationFrame(() => observe())
})
</script>

<template>
  <div class="artifacts-root" :class="{ 'artifacts-dark': isDark }">
    <!-- Top bar -->
    <div class="ax-sticky-bar sticky top-0 z-40 border-b px-4 py-3 lg:px-8">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div class="flex-1 lg:hidden">
          <SectionNavigation
            :sections="REVIEW_SECTIONS"
            :active-section="activeSection"
            :progress="progress"
            variant="horizontal"
          />
        </div>
        <div class="hidden min-w-0 flex-1 lg:block">
          <p class="text-sm font-medium ax-heading">{{ reviewContent.pageTitle }}</p>
          <p class="truncate text-xs ax-faint">
            {{ reviewContent.author }} · {{ reviewContent.pageSubtitle }}
          </p>
        </div>
        <button
          type="button"
          class="ax-theme-toggle ax-focus shrink-0"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        >
          <Icon :name="isDark ? 'light_mode' : 'dark_mode'" size="md" />
        </button>
      </div>
    </div>

    <div class="mx-auto flex max-w-6xl gap-12 px-4 lg:px-8">
      <aside class="sticky top-20 hidden h-fit w-40 shrink-0 pt-4 lg:block">
        <SectionNavigation
          :sections="REVIEW_SECTIONS"
          :active-section="activeSection"
          :progress="progress"
        />
      </aside>

      <main class="min-w-0 flex-1 pb-24">
        <EngineeringHero
          :title="reviewContent.hero.title"
          :badge="reviewContent.hero.badge"
          :author="reviewContent.author"
          :description="reviewContent.hero.description"
          :narrative-question="reviewContent.narrativeQuestion"
          :stats="reviewContent.hero.stats"
          :app-link="reviewContent.hero.links.app"
          :github-link="reviewContent.hero.links.github"
          :docs-link="reviewContent.hero.links.docs"
          :fictional-note="reviewContent.hero.fictionalNote"
        />

        <!-- Uncertainty -->
        <section id="uncertainty" class="er-section">
          <SectionHeader :title="uncertaintyContent.title" :subtitle="uncertaintyContent.subtitle" />
          <div class="mt-10">
            <Timeline
              :steps="uncertaintyContent.steps"
              :active-id="activeTimelineStep"
              @select="activeTimelineStep = $event"
            />
          </div>
        </section>

        <!-- Competitors -->
        <section id="competitors" class="er-section">
          <SectionHeader :title="competitorsContent.title" :subtitle="competitorsContent.subtitle" />
          <div class="mt-10 flex gap-4 overflow-x-auto pb-2">
            <CompetitorCard
              v-for="c in competitorsContent.competitors"
              :key="c.name"
              :competitor="c"
            />
          </div>
          <div class="ax-panel-emerald mt-8 p-5">
            <h3 class="ax-emerald-heading">Final Design Principles</h3>
            <ul class="mt-3 space-y-1">
              <li v-for="p in competitorsContent.designPrinciples" :key="p" class="text-sm ax-muted">{{ p }}</li>
            </ul>
          </div>
        </section>

        <!-- Decisions -->
        <section id="decisions" class="er-section">
          <SectionHeader :title="decisionsContent.title" :subtitle="decisionsContent.subtitle" />
          <div class="mt-10 space-y-3">
            <DecisionCard v-for="record in decisionsContent.records" :key="record.id" :record="record" />
          </div>
        </section>

        <!-- Architecture -->
        <section id="architecture" class="er-section">
          <SectionHeader :title="architectureContent.title" :subtitle="architectureContent.subtitle" />
          <div class="mt-10">
            <ArchitectureExplorer
              :flow="architectureContent.simplifiedFlow"
              :layers="architectureContent.layers"
              :principle="architectureContent.principle"
              :diagram-caption="architectureContent.diagramCaption"
              :active-id="activeArchLayer"
              :show-full-diagram="showFullDiagram"
              @select-layer="activeArchLayer = $event"
              @toggle-diagram="showFullDiagram = !showFullDiagram"
            />
          </div>
        </section>

        <!-- Implementation -->
        <section id="implementation" class="er-section">
          <SectionHeader :title="implementationContent.title" :subtitle="implementationContent.subtitle" />
          <div class="mt-10">
            <Roadmap :items="implementationContent.items" />
          </div>
        </section>

        <!-- Quality -->
        <section id="quality" class="er-section">
          <SectionHeader :title="qualityContent.title" :subtitle="qualityContent.subtitle" />
          <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QualityMetric v-for="metric in qualityContent.metrics" :key="metric.id" :metric="metric" />
          </div>
        </section>

        <!-- Trade-offs -->
        <section id="tradeoffs" class="er-section">
          <SectionHeader :title="tradeoffsContent.title" :subtitle="tradeoffsContent.subtitle" />
          <div class="mt-10 space-y-3">
            <TradeoffCard v-for="item in tradeoffsContent.items" :key="item.id" :item="item" />
          </div>
        </section>

        <!-- AI Collaboration -->
        <section id="ai-collaboration" class="er-section">
          <SectionHeader
            :title="aiCollaborationContent.title"
            :subtitle="aiCollaborationContent.subtitle"
          />

          <div class="mt-10 space-y-12">
            <PhilosophyHighlight
              :title="aiCollaborationContent.philosophy.title"
              :paragraphs="aiCollaborationContent.philosophy.paragraphs"
            />

            <div>
              <SubsectionTitle :title="aiCollaborationContent.workflow.title" />
              <div class="mt-6">
                <AiWorkflowTimeline
                  :stages="aiCollaborationContent.workflow.stages"
                  :active-id="activeAiWorkflowStage"
                  @select="activeAiWorkflowStage = $event"
                />
              </div>
            </div>

            <div>
              <SubsectionTitle :title="aiCollaborationContent.ownershipMatrix.title" />
              <div class="mt-6">
                <OwnershipMatrix :rows="aiCollaborationContent.ownershipMatrix.rows" />
              </div>
            </div>

            <div>
              <SubsectionTitle :title="aiCollaborationContent.tools.title" />
              <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AiToolCard
                  v-for="tool in aiCollaborationContent.tools.items"
                  :key="tool.name"
                  :tool="tool"
                />
              </div>
            </div>

            <div>
              <SubsectionTitle :title="aiCollaborationContent.principles.title" />
              <div class="mt-6 grid gap-3 sm:grid-cols-2">
                <AiPrincipleCard
                  v-for="principle in aiCollaborationContent.principles.items"
                  :key="principle.id"
                  :principle="principle"
                />
              </div>
            </div>

            <div>
              <SubsectionTitle :title="aiCollaborationContent.exampleWorkflow.title" />
              <div class="mt-6">
                <WorkflowFlowDiagram
                  :steps="aiCollaborationContent.exampleWorkflow.steps"
                  :caption="aiCollaborationContent.exampleWorkflow.caption"
                />
              </div>
            </div>

            <div>
              <SubsectionTitle :title="aiCollaborationContent.lessonsLearned.title" />
              <div class="mt-6">
                <AiLessonsLearned :columns="aiCollaborationContent.lessonsLearned.columns" />
              </div>
            </div>
          </div>
        </section>

        <!-- Retrospective -->
        <section id="retrospective" class="er-section">
          <SectionHeader :title="retrospectiveContent.title" :subtitle="retrospectiveContent.subtitle" />
          <div class="mt-10">
            <RetrospectiveColumns
              :worked-well="retrospectiveContent.workedWell"
              :tradeoffs-accepted="retrospectiveContent.tradeoffsAccepted"
              :next-iteration="retrospectiveContent.nextIteration"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
