export const audienceContent = {
  title: 'User Persona',
  subtitle: 'Before deciding what to build, I wanted to understand who would actually use it.',
  framing:
    'Design for an everyday user like Sofia — checking the weather before leaving home, commuting, planning activities, or traveling.',
  intro:
    "I imagined someone who simply wants to check the weather before leaving home, planning an activity, or traveling. They aren't looking for advanced meteorological data — they just want accurate information presented in a way that's easy to understand.",
  appShouldFeel: [
    { label: 'Simple & Fast', icon: 'bolt', description: 'Understand the weather in just a few seconds.' },
    { label: 'Highly Visual', icon: 'visibility', description: 'Condition-driven visuals communicate mood at a glance.' },
  ],
  deviceNote: 'Most people will probably use it on their phone, but it should work equally well on desktop.',
  persona: {
    name: 'Sofia',
    age: 31,
    occupation: 'Office Worker',
    image: '/engineering/sofia-persona.png',
    imageAlt: 'Sofia checking the weather on her phone at a modern office standing desk',
    usesAppWhen: ['Before leaving home', 'Before commuting', 'While planning weekend activities', 'Before traveling'],
    mainGoal: 'Understand the weather in just a few seconds.',
  },
}
