import type { Position, Velocity } from '../types/game.types'
import {
  GRAVITY,
  MAX_VELOCITY_Y,
  BONUS_LIFT,
  TORPEDO_DROP,
} from './constants'

export function updateVelocity(
  velocity: Velocity,
  bonusCollected: boolean,
  torpedoHit: boolean
): Velocity {
  const newVelocityX = velocity.x
  let newVelocityY = velocity.y + GRAVITY

  if (bonusCollected) {
    newVelocityY -= BONUS_LIFT
  }
  if (torpedoHit) {
    newVelocityY += TORPEDO_DROP
  }
  newVelocityY = Math.max(-MAX_VELOCITY_Y, Math.min(newVelocityY, MAX_VELOCITY_Y))

  return {
    x: newVelocityX,
    y: newVelocityY,
  }
}

export function updatePosition(
  position: Position,
  velocity: Velocity,
  deltaTime: number
): Position {
  return {
    x: position.x + velocity.x * deltaTime * 60,
    y: position.y + velocity.y * deltaTime * 60,
  }
}

export function checkCollision(
  pos1: Position,
  size1: { width: number; height: number },
  pos2: Position,
  size2: { width: number; height: number }
): boolean {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  )
}

export function generateParabolicTrajectory(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  peakHeight: number
): (x: number) => number {
  const h = (startX + endX) / 2
  const k = Math.min(startY, endY) - peakHeight
  const a = (startY - k) / Math.pow(startX - h, 2)
  
  return (x: number) => a * Math.pow(x - h, 2) + k
}

export function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
