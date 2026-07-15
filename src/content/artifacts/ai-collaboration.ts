import type { AiPrincipleData, AiWorkflowStageData } from './types'

export const aiCollaborationContent = {
  title: 'Using AI During the Project',
  subtitle:
    'AI was part of my workflow, but not my decision maker. Every suggestion was reviewed before becoming part of the project.',
  principle:
    'Use AI to accelerate exploration and preparation — architectural decisions, trade-offs, and final ownership stay with the engineer.',
  philosophy: {
    title: 'How I used AI',
    paragraphs: [
      'I created my own GPT to help throughout the project: challenge assumptions, explore approaches, compare architectural ideas, generate questions I had not considered, break work into steps, and prepare prompts for other tools.',
      'I see AI as a way to accelerate engineering work, not replace engineering judgment.',
    ],
  },
  uses: [
    'Challenge assumptions',
    'Explore different approaches',
    'Compare architectural ideas',
    'Generate questions I had not considered',
    'Break the project into manageable steps',
    'Prepare prompts for other AI tools',
  ],
  workflow: [
    {
      id: 'requirement',
      label: 'Requirement',
      aiContribution: [
        'Helped rephrase the open-ended request into concrete product questions',
        'Suggested dimensions of scope I might have overlooked',
      ],
      engineerResponsibility: [
        'Owned the final product boundary',
        'Decided what "weather app" meant for this assessment',
      ],
    },
    {
      id: 'research',
      label: 'Research',
      aiContribution: [
        'Summarized patterns across consumer weather apps',
        'Helped structure keep / leave-out comparisons',
      ],
      engineerResponsibility: [
        'Evaluated which patterns fit a two-week MVP',
        'Chose what to adopt and what to reject',
      ],
    },
    {
      id: 'architecture',
      label: 'Architecture',
      aiContribution: [
        'Explored alternative layerings and trade-offs',
        'Drafted questions to ask before locking the diagram',
      ],
      engineerResponsibility: [
        'Chose the four-layer SPA structure',
        'Drew boundaries in Eraser and owned the isolation principle',
      ],
    },
    {
      id: 'design',
      label: 'Design',
      aiContribution: [
        'Accelerated layout exploration in Stitch',
        'Helped enumerate states and components to define early',
      ],
      engineerResponsibility: [
        'Selected the visual direction',
        'Decided on condition-based local hero imagery',
      ],
    },
    {
      id: 'implementation',
      label: 'Implementation',
      aiContribution: [
        'Generated code for milestone-sized tasks in Cursor',
        'Helped draft scaffolding and repetitive wiring',
      ],
      engineerResponsibility: [
        'Defined milestone order and definition of done',
        'Reviewed every change against architecture and product intent',
      ],
    },
    {
      id: 'testing',
      label: 'Testing',
      aiContribution: [
        'Suggested test cases and edge conditions',
        'Helped draft unit test scaffolding',
      ],
      engineerResponsibility: [
        'Decided what must be covered',
        'Verified tests match real behavior and risk',
      ],
    },
    {
      id: 'deployment',
      label: 'Deployment',
      aiContribution: [
        'Helped compare hosting options for a Vue SPA',
        'Drafted deployment checklist items',
      ],
      engineerResponsibility: [
        'Chose Vercel and wired GitHub deployments',
        'Owned the public URL reviewers use',
      ],
    },
  ] satisfies AiWorkflowStageData[],
  principles: {
    title: 'Principles I followed',
    items: [
      {
        id: 'review',
        icon: 'rule',
        text: 'Every suggestion was reviewed before it became part of the project.',
      },
      {
        id: 'ownership',
        icon: 'verified_user',
        text: 'AI accelerated work — architectural decisions, trade-offs, and final ownership stayed with me.',
      },
      {
        id: 'judgment',
        icon: 'psychology',
        text: 'AI helps explore ideas faster; it does not replace engineering judgment.',
      },
    ] satisfies AiPrincipleData[],
  },
}
