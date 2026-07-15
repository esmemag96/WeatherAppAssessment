import type { TimelineStepData } from './types'

export const uncertaintyContent = {
  title: 'Starting Point',
  subtitle:
    'The original request was simple and intentionally open-ended, so before writing any code I needed to decide what kind of application I was actually building.',
  whatIChose:
    'Treat it as a focused web application: search a location, check the forecast, optionally save favorites — with everything stored client-side in LocalStorage.',
  quote: 'I want to have an application that will allow me to get weather forecast on a web for a selected location.',
  scopeNote:
    'The directive was simple, but the execution demanded architectural clarity. I decided on a client-only LocalStorage persistence model to prioritize privacy and keep the first version focused on search, forecast, and favorites.',
  removedFromScope: [
    'User Accounts',
    'Cloud Databases',
    'Password Recovery',
    'Tracking Cookies',
    'Authentication tokens',
    'Session management',
  ],
  steps: [
    {
      id: 'scope',
      label: 'Product scope',
      missing: 'What kind of application "create a weather app" actually meant.',
      assumption:
        'An independent web application that anyone can use at any time, without creating an account.',
      why: 'The request was one sentence long — I had to decide what I was building before writing a single line of code.',
      impact:
        'The main goal became simple: search for a location, check the forecast, and optionally save favorite cities.',
    },
    {
      id: 'authentication',
      label: 'Authentication',
      missing: 'Whether accounts or logins were expected.',
      assumption: "Skip authentication for this first version — it doesn't add enough value yet.",
      why: 'The core experience is search, forecast, and favorites. None of that requires an identity system.',
      impact: 'Removed user accounts, passwords, authentication tokens, a database, and session management from scope.',
    },
    {
      id: 'persistence',
      label: 'Persistence',
      missing: 'Where favorites and preferences would live without accounts.',
      assumption: 'Store favorites and user preferences directly in the browser using LocalStorage.',
      why: 'Without accounts, there is no server-side place for this data — and the app does not need one to be useful.',
      impact: 'Returning users still get a personalized experience without any backend infrastructure.',
    },
    {
      id: 'security',
      label: 'Security posture',
      missing: 'How much sensitive information the application needed to manage.',
      assumption:
        'Keeping everything client-side does not eliminate security concerns, but it significantly reduces the amount of sensitive information the app has to manage.',
      why: 'No accounts, no passwords, no tokens, no personal data — there is simply far less that can go wrong.',
      impact: 'The security conversation stays focused on the browser and API calls, not on protecting a login system.',
    },
  ] satisfies TimelineStepData[],
}
