import { easeInOut, lerp } from './gameMath'

export interface AnimationConfig {
  duration: number
  easing?: (t: number) => number
  onUpdate: (value: number) => void
  onComplete?: () => void
}

export class Animation {
  private startTime: number | null = null
  private config: AnimationConfig
  private animationFrameId: number | null = null
  private isRunning = false

  constructor(config: AnimationConfig) {
    this.config = {
      easing: easeInOut,
      ...config,
    }
  }

  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.startTime = Date.now()
    this.animate()
  }

  stop(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private animate = (): void => {
    if (!this.isRunning || this.startTime === null) return
    
    const now = Date.now()
    const elapsed = now - this.startTime
    const progress = Math.min(elapsed / this.config.duration, 1)
    
    const easedProgress = this.config.easing!(progress)
    this.config.onUpdate(easedProgress)
    
    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame(this.animate)
    } else {
      this.isRunning = false
      this.config.onComplete?.()
    }
  }
}

export function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): Animation {
  return new Animation({
    duration,
    onUpdate: (progress) => {
      const value = lerp(from, to, progress)
      onUpdate(value)
    },
    onComplete,
  })
}

export function createPulseAnimation(
  minScale: number,
  maxScale: number,
  duration: number
): Animation {
  let direction = 1
  let currentScale = minScale
  
  const pulse = (): void => {
    if (direction === 1 && currentScale >= maxScale) {
      direction = -1
    } else if (direction === -1 && currentScale <= minScale) {
      direction = 1
    }
  }
  
  return new Animation({
    duration,
    onUpdate: (progress) => {
      currentScale = lerp(
        direction === 1 ? minScale : maxScale,
        direction === 1 ? maxScale : minScale,
        progress
      )
      pulse()
    },
    onComplete: () => pulse(),
  })
}
