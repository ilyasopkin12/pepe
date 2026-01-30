import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export const selectGame = (state: RootState) => state.game

export const selectBetAmount = (state: RootState) => state.game.session.betAmount
export const selectCurrentBalance = (state: RootState) => state.game.session.currentBalance
export const selectDemoBalance = (state: RootState) => state.game.session.demoBalance
export const selectIsDemo = (state: RootState) => state.game.session.isDemo

export const selectIsPlaying = (state: RootState) => state.game.round.isPlaying
export const selectFinalResult = (state: RootState) => state.game.round.finalResult
export const selectLandingType = (state: RootState) => state.game.round.landingType
export const selectAutoplayCount = (state: RootState) => state.game.round.autoplayCount

export const selectCurrentMultiplier = (state: RootState) => state.game.flight.currentMultiplier
export const selectCollectedBonuses = (state: RootState) => state.game.flight.collectedBonuses
export const selectHitTorpedoes = (state: RootState) => state.game.flight.hitTorpedoes

export const selectSpeed = (state: RootState) => state.game.settings.speed

export const selectGameFlat = createSelector(
  [
    selectBetAmount,
    selectCurrentBalance,
    selectDemoBalance,
    selectIsDemo,
    selectIsPlaying,
    selectFinalResult,
    selectLandingType,
    selectAutoplayCount,
    selectCurrentMultiplier,
    selectCollectedBonuses,
    selectHitTorpedoes,
    selectSpeed,
  ],
  (
    betAmount,
    currentBalance,
    demoBalance,
    isDemo,
    isPlaying,
    finalResult,
    landingType,
    autoplayCount,
    currentMultiplier,
    collectedBonuses,
    hitTorpedoes,
    speed
  ) => ({
    betAmount,
    currentBalance,
    demoBalance,
    isDemo,
    isPlaying,
    finalResult,
    landingType,
    autoplayCount,
    currentMultiplier,
    collectedBonuses,
    hitTorpedoes,
    speed,
  })
)
