import type {
  AiLessonsColumn,
  AiPrincipleData,
  AiToolCardData,
  AiWorkflowStageData,
  OwnershipMatrixRow,
} from './types'

export const aiCollaborationContent = {
  title: 'AI Collaboration',
  subtitle:
    'How AI accelerated exploration, implementation and documentation while engineering ownership remained human.',
  philosophy: {
    title: 'Engineering Philosophy',
    paragraphs: [
      'Artificial Intelligence was treated as a collaborative engineering tool rather than a replacement for engineering judgment.',
      'It accelerated research, prototyping, documentation and implementation, while architectural decisions, trade-offs, validation and final ownership remained with the developer.',
    ],
  },
  workflow: {
    title: 'Workflow',
    stages: [
      {
        id: 'requirement',
        label: 'Requirement',
        aiContribution: [
          'Parsed ambiguous requirement language',
          'Surfaced undefined expectations',
          'Suggested clarification angles',
        ],
        engineerResponsibility: [
          'Interpreted the requirement',
          'Set assessment boundaries',
          'Defined what success looks like',
        ],
      },
      {
        id: 'discovery',
        label: 'Discovery',
        aiContribution: [
          'Generated discovery questions',
          'Suggested assumptions',
          'Highlighted missing requirements',
          'Proposed product alternatives',
        ],
        engineerResponsibility: [
          'Defined project scope',
          'Selected assumptions',
          'Prioritized requirements',
          'Accepted or rejected proposals',
        ],
      },
      {
        id: 'research',
        label: 'Research',
        aiContribution: [
          'Summarized competitors',
          'Compared weather providers',
          'Suggested UX patterns',
        ],
        engineerResponsibility: [
          'Evaluated trade-offs',
          'Selected applicable practices',
          'Rejected unnecessary complexity',
        ],
      },
      {
        id: 'architecture',
        label: 'Architecture',
        aiContribution: [
          'Proposed architectural patterns',
          'Suggested diagrams',
          'Compared alternatives',
          'Reviewed architecture',
        ],
        engineerResponsibility: [
          'Selected architecture',
          'Simplified unnecessary complexity',
          'Validated technical decisions',
          'Defined project boundaries',
        ],
      },
      {
        id: 'design',
        label: 'Design',
        aiContribution: [
          'Generated UI concepts',
          'Explored layouts',
          'Produced initial mockups',
        ],
        engineerResponsibility: [
          'Approved final design direction',
          'Refined interactions',
          'Defined reusable components',
          'Balanced UX against implementation effort',
        ],
      },
      {
        id: 'implementation',
        label: 'Implementation',
        aiContribution: [
          'Generated boilerplate',
          'Assisted with repetitive code',
          'Suggested refactoring',
          'Generated tests',
        ],
        engineerResponsibility: [
          'Reviewed every implementation',
          'Refactored generated code',
          'Ensured architectural consistency',
          'Verified correctness',
          'Fixed defects',
        ],
      },
      {
        id: 'testing',
        label: 'Testing',
        aiContribution: [
          'Suggested test cases',
          'Generated test scaffolding',
        ],
        engineerResponsibility: [
          'Validated coverage',
          'Added missing scenarios',
          'Executed testing',
          'Reviewed failures',
        ],
      },
      {
        id: 'deployment',
        label: 'Deployment',
        aiContribution: [
          'Suggested deployment configuration',
          'Reviewed CI/CD setup',
        ],
        engineerResponsibility: [
          'Configured deployment',
          'Verified production',
          'Monitored final application',
        ],
      },
    ] satisfies AiWorkflowStageData[],
  },
  ownershipMatrix: {
    title: 'Decision Ownership Matrix',
    rows: [
      { activity: 'Requirement Analysis', aiAssisted: true, humanDecision: true },
      { activity: 'Discovery', aiAssisted: true, humanDecision: true },
      { activity: 'Competitor Research', aiAssisted: true, humanDecision: true },
      { activity: 'Assumption Generation', aiAssisted: true, humanDecision: true },
      { activity: 'Product Scope', aiAssisted: true, humanDecision: true },
      { activity: 'Architecture', aiAssisted: true, humanDecision: true },
      { activity: 'Technology Selection', aiAssisted: true, humanDecision: true },
      { activity: 'UI Exploration', aiAssisted: true, humanDecision: true },
      { activity: 'Code Generation', aiAssisted: true, humanDecision: true },
      { activity: 'Code Review', aiAssisted: true, humanDecision: true },
      { activity: 'Testing Strategy', aiAssisted: true, humanDecision: true },
      { activity: 'Deployment', aiAssisted: true, humanDecision: true },
      { activity: 'Final Approval', aiAssisted: false, humanDecision: true },
      { activity: 'Engineering Ownership', aiAssisted: false, humanDecision: true },
    ] satisfies OwnershipMatrixRow[],
  },
  tools: {
    title: 'Tools Used',
    items: [
      {
        name: 'ChatGPT',
        purposes: [
          'discovery',
          'architecture discussions',
          'decision reviews',
          'documentation',
          'implementation planning',
        ],
        typicalOutput: 'Structured notes, ADR drafts, trade-off comparisons, and scope proposals.',
        whyUsed: 'Strong at synthesizing ambiguous requirements into reviewable engineering artifacts.',
      },
      {
        name: 'Cursor',
        purposes: ['implementation', 'refactoring', 'boilerplate', 'project scaffolding'],
        typicalOutput: 'Vue components, store modules, test files, and incremental refactors.',
        whyUsed: 'Tight editor integration kept generated code in context with the existing architecture.',
      },
      {
        name: 'Stitch',
        purposes: ['UI exploration', 'mockups', 'design direction'],
        typicalOutput: 'Layout explorations and visual references for dashboard and search flows.',
        whyUsed: 'Accelerated early UI direction without committing to unreviewed design decisions.',
      },
      {
        name: 'Eraser',
        purposes: ['architecture diagrams', 'technical documentation'],
        typicalOutput: 'Layer diagrams and data-flow sketches for architecture review.',
        whyUsed: 'Fast diagram iteration to validate structure before implementation.',
      },
      {
        name: 'GitHub',
        purposes: ['version control', 'project history', 'collaboration'],
        typicalOutput: 'Commit history, pull requests, and traceable engineering decisions.',
        whyUsed: 'Preserved ownership, reviewability, and accountability across the full workflow.',
      },
    ] satisfies AiToolCardData[],
  },
  principles: {
    title: 'Engineering Principles',
    items: [
      {
        id: 'ownership',
        icon: 'verified_user',
        text: 'AI accelerated work, not ownership. Every deliverable required explicit human acceptance.',
      },
      {
        id: 'review',
        icon: 'rule',
        text: 'Every architectural decision was reviewed manually against scope, complexity, and maintainability.',
      },
      {
        id: 'draft',
        icon: 'edit_note',
        text: 'Generated code was treated as a first draft — refactored to match project conventions before merge.',
      },
      {
        id: 'quality',
        icon: 'high_quality',
        text: 'Implementation quality mattered more than generation speed. Correctness and consistency were non-negotiable.',
      },
      {
        id: 'validation',
        icon: 'fact_check',
        text: 'Every final artifact was validated through tests, manual review, or production verification before acceptance.',
      },
    ] satisfies AiPrincipleData[],
  },
  exampleWorkflow: {
    title: 'Example Workflow',
    steps: [
      'Requirement',
      'AI-assisted exploration',
      'Engineering decisions',
      'Implementation',
      'Review',
      'Testing',
      'Deployment',
    ],
    caption:
      'The engineering process remained iterative. AI accelerated exploration and implementation, while engineering review determined what became part of the final solution.',
  },
  lessonsLearned: {
    title: 'Lessons Learned',
    columns: [
      {
        title: 'What AI did well',
        items: ['Research', 'Boilerplate', 'Documentation drafts', 'Architecture brainstorming'],
      },
      {
        title: 'Where human judgment mattered most',
        items: ['Architecture', 'Trade-offs', 'Scope', 'UX decisions', 'Quality'],
      },
      {
        title: 'Future Improvements',
        items: ['More automated evaluation', 'Reusable prompts', 'Prompt versioning', 'Prompt library'],
      },
    ] satisfies AiLessonsColumn[],
  },
}
