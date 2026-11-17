'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// Progressive enhancement: content stays visible before hydration and if scripts fail.
export function Reveal({
  children,
  className = '',
  stagger = false,
}: {
  children: ReactNode
  className?: string
  stagger?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || !('IntersectionObserver' in window) || !element.animate) return
    const animations: Animation[] = []
    const cancel = () => animations.forEach((animation) => animation.cancel())
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        if (preference.matches || element.contains(document.activeElement)) return
        const tokens = getComputedStyle(document.documentElement)
        const targets = stagger ? Array.from(element.children).slice(0, 4) : [element]
        targets.forEach((target, index) => {
          animations.push(
            target.animate(
              [
                { opacity: 0, transform: 'translateY(12px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: parseFloat(tokens.getPropertyValue('--motion-enter')) || 480,
                delay: stagger ? index * 60 : 0,
                easing: tokens.getPropertyValue('--ease-out').trim() || 'ease-out',
                fill: 'backwards',
              },
            ),
          )
        })
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    preference.addEventListener('change', cancel)
    element.addEventListener('focusin', cancel)
    return () => {
      observer.disconnect()
      cancel()
      preference.removeEventListener('change', cancel)
      element.removeEventListener('focusin', cancel)
    }
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
