export type ArtifactStatus = 'complete' | 'in-progress' | 'planned'

export interface SectionNavItem {
  id: string
  label: string
}

export interface HeroStat {
  label: string
  value: string
  description: string
}

export interface TimelineStepData {
  id: string
  label: string
  missing: string
  assumption: string
  rationale: string
  impact: string
}

export interface CompetitorCardData {
  name: string
  worksWell: string
  doesNot: string
  adopted: string
  rejected: string
}

export interface DecisionRecord {
  id: string
  title: string
  summary: string
  context: string
  decision: string
  alternatives: string[]
  tradeoffs: string[]
  futureEvolution: string
}

export interface ArchitectureLayerData {
  id: string
  name: string
  responsibility: string
  keyFiles: string[]
  dependencies: string[]
  tradeoff: string
}

export interface RoadmapItemData {
  id: string
  name: string
  progress: number
  status: ArtifactStatus
  goal: string
  deliverables: string[]
  dependencies: string[]
  definitionOfDone: string[]
}

export interface QualityMetricData {
  id: string
  label: string
  status: string
  description: string
  futureImprovement: string
}

export interface TradeoffItem {
  id: string
  decision: string
  reason: string
  cost: string
  futureImprovement: string
}

export interface AiWorkflowStageData {
  id: string
  label: string
  aiContribution: string[]
  engineerResponsibility: string[]
}

export interface OwnershipMatrixRow {
  activity: string
  aiAssisted: boolean
  humanDecision: boolean
}

export interface AiToolCardData {
  name: string
  purposes: string[]
  typicalOutput: string
  whyUsed: string
}

export interface AiPrincipleData {
  id: string
  icon: string
  text: string
}

export interface AiLessonsColumn {
  title: string
  items: string[]
}
