export const deploymentContent = {
  title: 'Deployment',
  subtitle:
    'Reviewers should be able to open a link and use the app immediately — without cloning a repo or running anything locally.',
  platform: 'Vercel',
  platformUrl: 'https://vercel.com',
  whyVercel:
    'I chose Vercel because it fits a Vue + Vite SPA extremely well: automatic GitHub deployments, preview URLs, HTTPS, and CDN delivery with no servers to manage.',
  decision:
    'Host the assessment on Vercel with GitHub-triggered builds. The live URL is the Vercel deployment reviewers use today — a separate custom-domain “production” environment is only a future step if this became a real product.',
  pipeline: [
    'Push to GitHub',
    'Vercel build',
    'Preview URL (branch)',
    'Production deploy (hypothetical)',
  ],
  pipelineCaption:
    'Branch previews are real today. A dedicated production environment (custom domain, stricter promotion) would be the next step — it is not set up for this assessment.',
  advantages: [
    'Zero infrastructure to operate',
    'Public Vercel URL ready for reviewers',
    'Preview deployments on every change',
    'HTTPS and CDN included out of the box',
  ],
  outcome:
    'Anyone reviewing the assessment can open the Vercel link and use the application without installing anything.',
}
