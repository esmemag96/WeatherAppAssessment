export const retrospectiveContent = {
  title: 'Final Thoughts',
  subtitle:
    'I approached this small application the same way I would a real product — and I am happy with how it evolved.',
  intro:
    'Closing the loop shows not just what shipped, but how the problem was approached and what was consciously accepted along the way.',
  whyPageExists: {
    title: 'Why this page exists',
    paragraphs: [
      'The application itself is only part of the assessment. I also wanted to document how I approached the problem.',
      'Rather than a collection of documents, this page tells the story of how an intentionally open requirement became a complete application.',
    ],
  },
  workedWell: [
    'Deciding scope before writing code prevented the build from sprawling.',
    'Documenting architecture early made development smoother — I was not solving structural problems while implementing features.',
    'Breaking work into milestones made supervising AI-generated code much easier.',
    'Deploying early meant the app was always in a demonstrable state.',
  ],
  wouldImprove: [
    'Earlier structured user testing — I validated late; some UX gaps would have surfaced sooner.',
    'More automated visual regression around condition-based hero states.',
    'Clearer progressive disclosure for favorites discovery on first visit.',
    'ESLint and Prettier — TypeScript and tests cover correctness, but lint/format tooling would tighten consistency for a team codebase.',
  ],
  wouldDoNext: [
    'Optional sync layer if accounts ever become valuable — without rewriting the domain.',
    'Deeper air-quality and alert storytelling once the core forecast loop is proven.',
    'Continue treating AI as a supervised collaborator with explicit ownership boundaries.',
  ],
  closingMessage:
    'Thank you for taking the time to review it. I look forward to discussing the project and answering any questions during the assessment.',
}
