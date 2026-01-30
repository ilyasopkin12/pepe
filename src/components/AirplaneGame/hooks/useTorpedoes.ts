import { useState, useCallback } from 'react'
import type { Torpedo, Position } from '../../../types/game.types'
import {
  TORPEDO_SPAWN_CHANCE,
  AIRPLANE_WIDTH,
  AIRPLANE_HEIGHT,
} from '../../../utils/constants'
import { randomBetween, checkCollision } from '../../../utils/gameMath'

let torpedoIdCounter = 0

export default function useTorpedoes() {
  const [torpedoes, setTorpedoes] = useState<Torpedo[]>([])

  const spawnTorpedo = useCallback((airplaneX: number) => {
    if (Math.random() > TORPEDO_SPAWN_CHANCE) return

    const newTorpedo: Torpedo = {
      id: `torpedo-${torpedoIdCounter++}`,
      position: {
        x: airplaneX + randomBetween(150, 300),
        y: randomBetween(200, 500),
      },
      velocity: {
        x: randomBetween(-1, 1),
        y: randomBetween(-0.5, 0.5),
      },
      hit: false,
    }

    setTorpedoes((prev) => [...prev, newTorpedo])
  }, [])

  const update = useCallback((deltaTime: number) => {
    setTorpedoes((prev) =>
      prev.map((torpedo) => ({
        ...torpedo,
        position: {
          x: torpedo.position.x + torpedo.velocity.x * deltaTime * 30,
          y: torpedo.position.y + torpedo.velocity.y * deltaTime * 30,
        },
      }))
    )
  }, [])

  const checkCollisions = useCallback((airplanePos: Position): boolean => {
    for (const torpedo of torpedoes) {
      if (torpedo.hit) continue

      const collision = checkCollision(
        airplanePos,
        { width: AIRPLANE_WIDTH, height: AIRPLANE_HEIGHT },
        torpedo.position,
        { width: 70, height: 30 }
      )

      if (collision) {
        setTorpedoes((prev) =>
          prev.map((t) => (t.id === torpedo.id ? { ...t, hit: true } : t))
        )
        return true
      }
    }
    return false
  }, [torpedoes])

  const reset = useCallback(() => {
    setTorpedoes([])
    torpedoIdCounter = 0
  }, [])

  return {
    torpedoes,
    spawnTorpedo: (airplaneX: number) => spawnTorpedo(airplaneX),
    update,
    checkCollisions,
    reset,
  }
}
