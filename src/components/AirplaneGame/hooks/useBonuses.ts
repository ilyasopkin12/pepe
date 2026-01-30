import { useState, useCallback } from 'react'
import type { Bonus, Position } from '../../../types/game.types'
import { BonusType } from '../../../types/game.types'
import {
  BONUS_SPAWN_CHANCE,
  ADDITIVE_BONUSES,
  MULTIPLICATIVE_BONUSES,
  AIRPLANE_WIDTH,
  AIRPLANE_HEIGHT,
} from '../../../utils/constants'
import { randomBetween, randomElement, checkCollision } from '../../../utils/gameMath'

let bonusIdCounter = 0

export default function useBonuses() {
  const [bonuses, setBonuses] = useState<Bonus[]>([])

  const spawnBonus = useCallback((airplaneX: number) => {
    if (Math.random() > BONUS_SPAWN_CHANCE) return

    const isMultiplicative = Math.random() > 0.6
    const value = isMultiplicative
      ? randomElement(MULTIPLICATIVE_BONUSES)
      : randomElement(ADDITIVE_BONUSES)

    const newBonus: Bonus = {
      id: `bonus-${bonusIdCounter++}`,
      position: {
        x: airplaneX + randomBetween(150, 300),
        y: randomBetween(100, 500),
      },
      type: isMultiplicative ? BonusType.MULTIPLICATIVE : BonusType.ADDITIVE,
      value,
      collected: false,
    }

    setBonuses((prev) => [...prev, newBonus])
  }, [])

  const spawnBonusAt = useCallback((position: Position) => {
    const isMultiplicative = Math.random() > 0.6
    const value = isMultiplicative
      ? randomElement(MULTIPLICATIVE_BONUSES)
      : randomElement(ADDITIVE_BONUSES)

    const newBonus: Bonus = {
      id: `bonus-${bonusIdCounter++}`,
      position,
      type: isMultiplicative ? BonusType.MULTIPLICATIVE : BonusType.ADDITIVE,
      value,
      collected: false,
    }

    setBonuses((prev) => [...prev, newBonus])
  }, [])

  const checkCollisions = useCallback((airplanePos: Position): Bonus | null => {
    for (const bonus of bonuses) {
      if (bonus.collected) continue

      const collision = checkCollision(
        airplanePos,
        { width: AIRPLANE_WIDTH, height: AIRPLANE_HEIGHT },
        bonus.position,
        { width: 60, height: 60 }
      )

      if (collision) {
        setBonuses((prev) =>
          prev.map((b) => (b.id === bonus.id ? { ...b, collected: true } : b))
        )
        return bonus
      }
    }
    return null
  }, [bonuses])

  const reset = useCallback(() => {
    setBonuses([])
    bonusIdCounter = 0
  }, [])

  return {
    bonuses,
    spawnBonus: (airplaneX: number) => spawnBonus(airplaneX),
    spawnBonusAt,
    checkCollisions,
    reset,
  }
}
