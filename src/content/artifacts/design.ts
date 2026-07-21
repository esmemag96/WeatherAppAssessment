export const designContent = {
  title: 'Designing the Experience',
  subtitle:
    'Once I knew what I wanted to build, I used Stitch to explore different layouts and generate the first mockups — not as final designs, but as a fast way to iterate until the direction felt clean, modern, and easy to understand.',
  tool: 'Stitch',
  toolUrl: 'https://stitch.withgoogle.com',
  definedAreas: [
    'Visual hierarchy',
    'Layout',
    'Typography',
    'Reusable components',
    'Responsive behavior',
    'Loading and error states',
  ],
  mockups: {
    caption: 'Stitch high-fidelity exploration — palette, typography, and screens for weather, search, favorites, settings, loading, and error.',
    images: [
      {
        src: '/engineering/stitch-design.png',
        alt: 'Stitch design workspace showing Nimbus Digital mockups: color palette, typography, and screens for weather, search, favorites, settings, loading, and error states',
      },
    ],
  },
  heroImagery: {
    intro:
      'One design detail I particularly liked was using large imagery behind the weather card. Originally I considered showing a different image for every city, since it was in the Stitch mockups, but that would require another external API.',
    decision:
      'Instead, I decided to use local images based on the current weather condition — keeping the interface visually interesting without introducing another dependency.',
    conditions: ['Clear', 'Cloudy', 'Rain', 'Storm', 'Snow', 'Fog', 'Night'],
  },
}
