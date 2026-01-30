import { useEffect, useRef } from 'react'

interface GameLoopOptions {
  isActive: boolean
  speed: number
  onUpdate: (deltaTime: number) => void
}

export default function useGameLoop({ isActive, speed, onUpdate }: GameLoopOptions) {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    if (!isActive) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      previousTimeRef.current = null
      return
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = (time - previousTimeRef.current) / 1000 * speed
        onUpdateRef.current(deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive, speed])
}
