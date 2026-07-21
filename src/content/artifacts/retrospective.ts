export interface RetrospectiveItem {
  title: string
  body: string
}

export const retrospectiveContent = {
  title: 'Final Thoughts',
  subtitle:
    'I approached this small application the same way I would a real product — and I am happy with how it evolved.',
  intro:
    'The final application shows what I built, but it doesn’t show all the decisions that led to it. I created this page to make that process visible — from the assumptions I made at the beginning to the architecture, design, trade-offs, AI usage, and final implementation.',
  whyPageExists: {
    title: 'Why I created this page',
    paragraphs: [
      'Rather than a collection of documents, this page tells the story of how an intentionally open requirement became a complete application.',
    ],
  },
  workedWell: [
    {
      title: 'Defining the scope before I started coding.',
      body: 'With such an open requirement, deciding what I wasn’t going to build was just as important as deciding what I would.',
    },
    {
      title: 'Thinking about the architecture early.',
      body: 'Having the main responsibilities clear before implementation made development smoother and helped me avoid restructuring the project halfway through.',
    },
    {
      title: 'Building and validating the project in smaller steps.',
      body: 'Working in milestones made it easier to review AI-generated code and validate each part before moving on.',
    },
    {
      title: 'Treating quality as part of the implementation.',
      body: 'Adding unit, component, and E2E tests, together with TypeScript checks, gave me different levels of confidence instead of relying only on manual testing.',
    },
  ] satisfies RetrospectiveItem[],
  wouldImprove: [
    {
      title: 'I’d involve users earlier.',
      body: 'I collected feedback once the application was already quite developed. Next time, I’d validate some of the initial assumptions and mockups before implementation.',
    },
    {
      title: 'I’d start structured accessibility testing earlier.',
      body: 'Accessibility was considered during development, but I’d like keyboard, screen-reader, and contrast testing to be part of the process from the beginning.',
    },
    {
      title: 'I’d add visual regression testing.',
      body: 'Because the UI changes across weather conditions, themes, and screen sizes, automated screenshot comparisons could help catch visual changes that functional tests may not detect.',
    },
  ] satisfies RetrospectiveItem[],
  wouldDoNext: [
    {
      title: 'Improve the offline experience.',
      body: 'The app currently has session-level caching, but persisting the last successful forecast could make it more useful when connectivity is unreliable.',
    },
    {
      title: 'Keep improving alerts and secondary weather information.',
      body: 'I would explore how to make information such as air quality and weather alerts more useful without making the main forecast experience too busy.',
    },
    {
      title: 'Revisit accounts and synchronization only if the product needs them.',
      body: 'If users eventually wanted favorites and preferences across devices, I would then consider authentication, a backend, and cloud persistence.',
    },
  ] satisfies RetrospectiveItem[],
  closingMessage:
    'Thank you for taking the time to review it. I look forward to discussing the project and answering any questions during the assessment. :)',
}
