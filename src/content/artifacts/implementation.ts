import type { RoadmapItemData } from './types'

export const implementationContent = {
  title: 'Building the Application',
  subtitle:
    'Once the architecture and design were defined, I started implementation with Cursor — dividing the project into smaller milestones so I could supervise every generated change and keep the architecture consistent.',
  tool: 'Cursor',
  toolUrl: 'https://cursor.com',
  approach:
    'Rather than asking Cursor to build the entire application in one prompt, I divided the project into smaller milestones. That made it much easier to supervise the generated code and keep the architecture consistent.',
  items: [
    {
      id: 'foundation',
      label: 'Project foundation',
      goal: 'Stand up the project skeleton and core conventions.',
    },
    {
      id: 'domain',
      label: 'Domain models',
      goal: 'Define the core concepts the application reasons about.',
    },
    {
      id: 'api',
      label: 'API integration',
      goal: 'Connect to Open-Meteo through repository adapters and mappers.',
    },
    {
      id: 'state',
      label: 'State management',
      goal: 'Coordinate shared application state across screens.',
    },
    {
      id: 'design-system',
      label: 'Design system',
      goal: 'Translate Stitch mockups into reusable Vue components and tokens.',
    },
    {
      id: 'search',
      label: 'Location search',
      goal: 'Let a user find and select a location.',
    },
    {
      id: 'forecast',
      label: 'Forecast screens',
      goal: 'Show the current, hourly, and daily forecast for a selected location.',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      goal: 'Let users save and quickly return to locations.',
    },
    {
      id: 'states',
      label: 'Loading and error states',
      goal: 'Handle slow networks and failures gracefully.',
    },
    {
      id: 'testing',
      label: 'Testing',
      goal: 'Validate domain logic, mappers, and key user flows.',
    },
    {
      id: 'documentation',
      label: 'Documentation',
      goal: 'Document the reasoning behind the project, not just the code.',
    },
    {
      id: 'deployment',
      label: 'Deployment',
      goal: 'Make the app reachable without any local setup.',
    },
  ] satisfies RoadmapItemData[],
}
