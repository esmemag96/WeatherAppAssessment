export type ArtifactStatus = 'complete' | 'in-progress' | 'planned'
export type QualityStatus = 'complete' | 'partial' | 'planned'

export interface SectionNavItem {
  id: string
  label: string
  icon?: string
}

export interface HeroStat {
  label: string
  value: string
  description?: string
}

export interface ProposalContent {
  summary: string
  why: string
  decision: string
  benefits: string[]
}

export interface TimelineStepData {
  id: string
  label: string
  missing: string
  assumption: string
  why: string
  impact: string
}

export interface CompetitorCardData {
  id: string
  name: string
  worksWell: string
  doesntWork: string
  adopted: string
  rejected: string
}

export interface DecisionTabs {
  context: string
  decision: string
  alternatives: string
  tradeoffs: string
  future: string
}

export interface DecisionRecord {
  id: string
  title: string
  summary: string
  why: string
  decisionPlain: string
  benefits: string[]
  tabs: DecisionTabs
}

export interface ArchitectureLayerData {
  id: string
  label: string
  responsibility: string
  keyFiles: string[]
  dependencies: string[]
  tradeoffs: string
}

export interface ArchitectureDiagramData {
  src: string
  src2x?: string
  width?: number
  height?: number
  alt: string
  explanation: string
  highlights: string[]
}

export interface RoadmapItemData {
  id: string
  label: string
  progress: number
  goal: string
  deliverables: string[]
  dependencies: string[]
  definitionOfDone: string[]
}

export interface QualityMetricData {
  id: string
  label: string
  status: QualityStatus
  description: string
  futureImprovements: string
}

export interface TradeoffItem {
  id: string
  decision: string
  why: string
  cost: string
  future: string
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
  url?: string
}

export interface ToolLink {
  name: string
  url: string
  role: string
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

export interface PersonaData {
  name: string
  age: number
  occupation: string
  image?: string
  imageAlt?: string
  usesAppWhen: string[]
  mainGoal: string
}

export interface DeploymentBenefitPanel {
  heading: string
  intro: string
  benefits: string[]
  outcome: string
}
