import type { HeroStat, SectionNavItem } from './types'

/** Primary sidebar navigation — matches the Stitch Engineering Portal layout. */
export const STITCH_NAV_SECTIONS: SectionNavItem[] = [
  { id: 'uncertainty', label: 'Starting Point', icon: 'rocket_launch' },
  { id: 'audience', label: 'Audience', icon: 'group' },
  { id: 'architecture', label: 'Technical Direction', icon: 'architecture' },
  { id: 'implementation', label: 'Build Process', icon: 'construction' },
]

/** Full in-page anchors for scroll tracking. */
export const REVIEW_SECTIONS: SectionNavItem[] = [
  { id: 'summary', label: 'Summary', icon: 'home' },
  { id: 'uncertainty', label: 'Starting Point', icon: 'rocket_launch' },
  { id: 'audience', label: 'Audience', icon: 'group' },
  { id: 'competitors', label: 'Research', icon: 'travel_explore' },
  { id: 'ai-collaboration', label: 'AI', icon: 'auto_awesome' },
  { id: 'architecture', label: 'Architecture', icon: 'architecture' },
  { id: 'design', label: 'Design', icon: 'palette' },
  { id: 'implementation', label: 'Delivery', icon: 'construction' },
  { id: 'deployment', label: 'Deployment', icon: 'rocket' },
  { id: 'feedback', label: 'Feedback', icon: 'forum' },
  { id: 'retrospective', label: 'Review', icon: 'rate_review' },
]

export function resolveStitchNavSection(sectionId: string): string {
  if (sectionId === 'summary' || sectionId === 'uncertainty') return 'uncertainty'
  if (sectionId === 'audience' || sectionId === 'competitors') return 'audience'
  if (sectionId === 'ai-collaboration' || sectionId === 'architecture' || sectionId === 'design') {
    return 'architecture'
  }
  return 'implementation'
}

export const reviewContent = {
  pageTitle: 'Engineering Review',
  portalTitle: 'Esmeralda Weather App',
  portalSubtitle: 'Engineering Portal',
  breadcrumb: 'Engineering Review',
  author: 'Esmeralda Magdaleno',
  authorRole: 'Frontend Engineer',
  pageSubtitle: 'How an open requirement became a complete application',
  narrativeQuestion: 'How did "Create a weather app" become the app you can use right now?',
  hero: {
    title: 'Weather App by Esmeralda',
    badge: 'Technical Journey',
    description:
      'A deep dive into the architecture, philosophy, and iterative refinement behind the Weather App by Esmeralda.',
    stats: [
      { label: 'Requirement', value: '1 intentionally open-ended request' },
      { label: 'Scope', value: 'Independent web app, no accounts' },
      { label: 'Architecture', value: '4-layer frontend SPA' },
      { label: 'Delivery', value: 'Production-ready Vue application' },
    ] satisfies HeroStat[],
    links: {
      app: '/app',
      github: 'https://github.com/esmemag96/WeatherAppAssessment',
    },
  },
  coherentAttribution: {
    text: 'Esmeralda Magdaleno for the Coherent Solutions take away task',
    logos: {
      darkMode: '/engineering/coherent-logo-dark-mode.png',
      lightMode: '/engineering/coherent-logo-light-mode.png',
    },
  },
}
