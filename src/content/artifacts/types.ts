export interface SectionNavItem {
  id: string
  label: string
  icon?: string
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
  goal: string
}

export interface AiWorkflowStageData {
  id: string
  label: string
  aiContribution: string[]
  engineerResponsibility: string[]
}

export interface ToolLink {
  name: string
  url: string
  role: string
}
