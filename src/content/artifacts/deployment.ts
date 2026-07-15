export const deploymentContent = {
  title: 'Deployment',
  subtitle:
    'Reviewers should be able to open a link and use the app immediately — without cloning a repo or running anything locally.',
  platform: 'Vercel',
  platformUrl: 'https://vercel.com',
  whyVercel:
    'I chose Vercel because it fits a Vue + Vite SPA extremely well: automatic GitHub deployments, preview URLs, HTTPS, and CDN delivery with no servers to manage.',
  decision: 'Deploy to Vercel with automatic GitHub deployments and preview URLs for every branch.',
  pipeline: ['Push to GitHub', 'Vercel build', 'Preview URL (branch)', 'Production deploy'],
  pipelineCaption: 'Every change is reviewable in a browser before it reaches production.',
  advantages: [
    'Zero infrastructure to operate',
    'Public URL ready for reviewers',
    'Preview deployments on every change',
    'HTTPS and CDN included out of the box',
  ],
  outcome:
    'Anyone reviewing the assessment can simply open a link and start using the application without installing anything.',
}
