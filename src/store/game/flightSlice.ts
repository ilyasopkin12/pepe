import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Bonus } from '../../types/game.types'
import { startGame, resetGame } from './roundSlice'

export interface FlightState {
  currentMultiplier: number
  collectedBonuses: Bonus[]
  hitTorpedoes: number
}

const initialState: FlightState = {
  currentMultiplier: 1,
  collectedBonuses: [],
  hitTorpedoes: 0,
}

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    collectBonus: (state, action: PayloadAction<{ bonus: Bonus; betAmount: number }>) => {
      const { bonus, betAmount } = action.payload
      state.collectedBonuses.push(bonus)
      if (bonus.type === 'additive') {
        state.currentMultiplier += bonus.value / betAmount
      } else {
        state.currentMultiplier *= bonus.value
      }
    },
    hitTorpedo: (state) => {
      state.hitTorpedoes += 1
      state.currentMultiplier /= 2
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame, () => initialState)
      .addCase(resetGame, () => initialState)
  },
})

export const { collectBonus, hitTorpedo } = flightSlice.actions
export default flightSlice.reducer
