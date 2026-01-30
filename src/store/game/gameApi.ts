import type { GameResult } from '../../types/game.types'
import { LandingType } from '../../types/game.types'

export const playGameApi = async (
  betAmount: number,
  isDemo: boolean
): Promise<GameResult> => {
  void isDemo
  await new Promise(resolve => setTimeout(resolve, 100))

  const random = Math.random()
  let result: number
  let landingType: LandingType

  if (random < 0.6) {
    result = 0
    landingType = LandingType.WATER
  } else {
    const multiplier = 1.2 + Math.random() * 10
    result = betAmount * multiplier
    landingType = LandingType.SHIP_WIN
  }

  return {
    result: Math.floor(result * 100) / 100,
    balance: 0,
    demoBalance: 0,
    landingType,
  }
}

export const stopAutoplayApi = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 50))
}
