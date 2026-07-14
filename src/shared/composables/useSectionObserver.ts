import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useSectionObserver(sectionIds: string[]): {
  activeSection: Ref<string>
  observe: () => void
} {
  const activeSection = ref(sectionIds[0] ?? '')
  let observer: IntersectionObserver | null = null

  function observe(): void {
    observer?.disconnect()

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          activeSection.value = visible[0].target.id
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
  }

  onMounted(() => {
    observe()
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection, observe }
}

export function scrollToSection(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
