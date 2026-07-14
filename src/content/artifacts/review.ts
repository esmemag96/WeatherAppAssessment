import type { HeroStat, SectionNavItem } from './types'

export const REVIEW_SECTIONS: SectionNavItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'uncertainty', label: 'Uncertainty' },
  { id: 'competitors', label: 'Research' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'implementation', label: 'Delivery' },
  { id: 'quality', label: 'Quality' },
  { id: 'tradeoffs', label: 'Trade-offs' },
  { id: 'ai-collaboration', label: 'AI' },
  { id: 'retrospective', label: 'Review' },
]

export const reviewContent = {
  pageTitle: 'Engineering Review',
  author: 'Esmeralda Magdaleno',
  pageSubtitle:
    'An overview of the engineering process, architectural decisions and implementation strategy behind the Weather Forecast application.',
  narrativeQuestion: 'How was an ambiguous requirement transformed into a production-ready application?',
  hero: {
    title: 'Weather Forecast',
    badge: 'Senior Frontend Engineering Assessment',
    description:
      'An overview of the engineering process, architectural decisions and implementation strategy behind the Weather Forecast application.',
    fictionalNote:
      'Nimbus Digital and Emma Carter are fictional personas created only to simulate stakeholder context during this assessment.',
    stats: [
      { label: 'Requirement', value: '1', description: 'intentionally ambiguous requirement' },
      { label: 'Assumptions', value: '8', description: 'assumptions documented' },
      { label: 'Architecture', value: '9', description: 'major engineering decisions' },
      { label: 'Delivery', value: '1', description: 'production-ready Vue application' },
    ] satisfies HeroStat[],
    links: {
      app: '/app',
      github: 'https://github.com/placeholder/weather-forecast-app',
      docs: '/docs',
    },
  },
}
