import type { ProposalContent } from './types'

export const sectionProposals = {
  summary: {
    summary:
      'This page tells the story of how an intentionally open requirement — "Create a weather app" — became a complete, deployable application.',
    why: 'The application itself is only part of the assessment. Reviewers also need to understand how the problem was approached, what was decided, and why.',
    decision:
      'Document the full journey: scope, audience, research, architecture, design, implementation, deployment, feedback, and final reflections — in plain language first.',
    benefits: [
      'Reviewers get a quick overview before diving into detailed documentation',
      'Shows engineering thinking, not just working code',
      'Makes assumptions and trade-offs visible early',
      'Tells a coherent story instead of a collection of disconnected documents',
    ],
  },
  uncertainty: {
    summary:
      'The original request was one sentence long. Before writing any code, I decided to build an independent web app that anyone can use without creating an account.',
    why: 'Without clear scope, a weather app could mean anything — from a radar platform to a simple forecast tool. Someone had to draw the boundary first.',
    decision:
      'Treat it as a focused web application: search a location, check the forecast, optionally save favorites — with everything stored client-side in LocalStorage.',
    benefits: [
      'No user accounts, passwords, tokens, database, or session management',
      'Significantly less sensitive data to manage',
      'Faster path to a shippable MVP',
      'Clear product boundary from day one',
    ],
  },
  audience: {
    summary:
      'Before deciding what to build, I wanted to understand who would actually use it — someone who wants accurate weather information presented in a way that is easy to understand.',
    why: 'Features and design choices only make sense when you know who you are building for and when they will reach for the app.',
    decision:
      'Design for a everyday user like Sofia — checking the weather before leaving home, commuting, planning activities, or traveling.',
    benefits: [
      'Simple, fast, visual, and pleasant enough to use every day',
      'Mobile-first, but equally usable on desktop',
      'Focus on understanding the weather in just a few seconds',
      'Avoids advanced meteorological data that most users do not need',
    ],
  },
  competitors: {
    summary:
      'I reviewed Apple Weather, Google Weather, AccuWeather, The Weather Channel, and Windy — not to copy one app, but to learn what works within a two-week time limit.',
    why: 'Users already have expectations shaped by existing products. Ignoring that context leads to unfamiliar or over-built interfaces.',
    decision:
      'Keep what works — current weather focus, fast search, clear forecasts, condition visuals, mobile-first — and explicitly leave out radar, news, ads, advanced metrics, city image APIs, and accounts.',
    benefits: [
      'Grounded UX in proven consumer patterns',
      'Clear included/excluded product boundary',
      'Avoided rebuilding features with low MVP value',
      'Informed visual hierarchy without external design dependencies',
    ],
  },
  aiCollaboration: {
    summary:
      'AI was part of my workflow, but not my decision maker. I created my own GPT to challenge assumptions, explore approaches, and break the project into manageable steps.',
    why: 'Using AI without clear boundaries creates doubt about authorship and judgment. Being explicit about how it was used builds trust with reviewers.',
    decision:
      'Use AI to accelerate exploration and preparation — every suggestion was reviewed before becoming part of the project.',
    benefits: [
      'Faster iteration on ideas, architecture, and project planning',
      'Human ownership preserved on all final decisions',
      'Demonstrates responsible use of modern engineering tools',
      'AI accelerates work without replacing engineering judgment',
    ],
  },
  architecture: {
    summary:
      'I built a frontend SPA with Vue and used Eraser to visualize the system before writing code — organized into Presentation, Application, Domain, and Infrastructure.',
    why: 'Weather providers change APIs and response shapes often. If the UI speaks "Open-Meteo," every provider swap becomes a rewrite.',
    decision:
      'Isolate external services behind clear boundaries so replacing Open-Meteo — or adding a backend later — does not require rewriting the application.',
    benefits: [
      'Each layer has a clear responsibility',
      'Architecture decisions documented before implementation started',
      'External services isolated from domain logic',
      'Most of the app stays unchanged if the provider changes',
    ],
  },
  design: {
    summary:
      'I used Stitch to explore layouts and generate first mockups — iterating until the direction felt clean, modern, and easy to understand.',
    why: 'Jumping straight into code without a visual direction leads to inconsistent UI and wasted rework.',
    decision:
      'Use mockups to define hierarchy, layout, typography, components, responsive behavior, and states — then use local condition-based hero imagery instead of a city image API.',
    benefits: [
      'Fast iteration on visual direction before committing to code',
      'Reusable components defined early',
      'Visually interesting hero without another network dependency',
      'Loading and error states planned from the start',
    ],
  },
  implementation: {
    summary:
      'I used Cursor for agentic development, dividing the project into twelve milestones rather than building everything in one prompt.',
    why: 'Big-bang AI generation is hard to review and tends to drift from the architecture. Smaller milestones keep supervision practical.',
    decision:
      'Implement in order: foundation, domain, API, state, design system, search, forecast, favorites, states, testing, documentation, deployment.',
    benefits: [
      'Every milestone left the app in a working state',
      'Easier to review and debug AI-generated code',
      'Architecture stayed consistent throughout',
      'Clear definition of done at each stage',
    ],
  },
  deployment: {
    summary:
      'I chose Vercel for a Vue + Vite SPA — automatic deployments, preview URLs, HTTPS, and CDN delivery with no servers to manage.',
    why: 'Reviewers should be able to open a link and use the app immediately, without cloning a repo or running anything locally.',
    decision: 'Deploy to Vercel with automatic GitHub deployments and preview URLs for every branch.',
    benefits: [
      'Zero infrastructure to operate',
      'Public URL ready for reviewers',
      'Preview deployments on every change',
      'HTTPS and CDN included out of the box',
    ],
  },
  feedback: {
    summary:
      'Once I had a stable version, I asked people to use the app and validate whether my assumptions actually made sense.',
    why: 'The original requirements were intentionally ambiguous. Real usage feedback is the best way to know if the product direction works.',
    decision:
      'Focus feedback on search intuitiveness, forecast clarity, mobile feel, and favorites discoverability — then prioritize improvements before calling the project finished.',
    benefits: [
      'Validated assumptions against real usage',
      'Surfaced gaps that were not obvious during development',
      'Prioritized improvements with user input, not guesses',
      'Closed the loop between build and review',
    ],
  },
  retrospective: {
    summary:
      'I approached this small application the same way I would a real product — and I am happy with how it evolved.',
    why: 'Closing the loop shows not just what shipped, but how the problem was approached and what was consciously accepted along the way.',
    decision:
      'Document the reasoning behind the project on this page, so reviewers understand both what was built and how the thinking evolved.',
    benefits: [
      'Clear signal on product and engineering maturity',
      'Honest reflection on trade-offs and AI-assisted workflow',
      'Useful for both technical and non-technical reviewers',
      'Sets up a meaningful conversation during the assessment',
    ],
  },
} satisfies Record<string, ProposalContent>
