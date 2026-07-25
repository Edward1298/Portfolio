import { motion } from 'framer-motion'
import { useEffect, useRef, useState, useMemo } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion.js'
import './BlurText.css'

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))])
  const keyframes = {}
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])]
  })
  return keyframes
}

export default function BlurText({
  text = '',
  delay = 200,
  initialDelay = 0,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35,
  gradientColors = [],
}) {
  const reduced = usePrefersReducedMotion()
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)
  const observedRef = useRef(false)

  useEffect(() => {
    if (reduced) {
      setInView(true)
      return
    }
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observedRef.current) {
          observedRef.current = true
          if (initialDelay > 0) {
            setTimeout(() => setInView(true), initialDelay)
          } else {
            setInView(true)
          }
          observer.unobserve(ref.current)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin, reduced, initialDelay])

  const defaultFrom = useMemo(
    () => {
      if (direction === 'left') return { filter: 'blur(10px)', opacity: 0, x: -50 }
      if (direction === 'right') return { filter: 'blur(10px)', opacity: 0, x: 50 }
      return direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 }
    },
    [direction]
  )

  const defaultTo = useMemo(
    () => {
      if (direction === 'left' || direction === 'right') {
        return [
          { filter: 'blur(5px)', opacity: 0.5, x: direction === 'left' ? 5 : -5 },
          { filter: 'blur(0px)', opacity: 1, x: 0 }
        ]
      }
      return [
        {
          filter: 'blur(5px)',
          opacity: 0.5,
          y: direction === 'top' ? 5 : -5
        },
        { filter: 'blur(0px)', opacity: 1, y: 0 }
      ]
    },
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  const hasGradient = gradientColors.length >= 2

  const gradientStyle = hasGradient ? {
    backgroundImage: `linear-gradient(to right, ${gradientColors.join(', ')}, ${gradientColors[0]})`,
    backgroundSize: '300% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  } : {}

  if (reduced) {
    return (
      <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {elements.map((segment, index) => (
          <span
            key={index}
            className={`inline-block ${hasGradient ? 'blur-text-gradient' : ''}`}
            style={hasGradient ? gradientStyle : {}}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </span>
        ))}
      </p>
    )
  }

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000
        }
        spanTransition.ease = easing

        return (
          <motion.span
            className={`inline-block will-change-[transform,filter,opacity] ${hasGradient ? 'blur-text-gradient' : ''}`}
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            style={hasGradient ? gradientStyle : {}}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </p>
  )
}
