import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { LandingType } from '../../types/game.types'

export interface RoundState {
  isPlaying: boolean
  finalResult: number | null
  landingType: LandingType | null
  autoplayCount: number | null
}

const initialState: RoundState = {
  isPlaying: false,
  finalResult: null,
  landingType: null,
  autoplayCount: null,
}

const roundSlice = createSlice({
  name: 'round',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true
      state.finalResult = null
      state.landingType = null
    },
    endGame: (state, action: PayloadAction<{ result: number; landingType: LandingType }>) => {
      state.isPlaying = false
      state.finalResult = action.payload.result
      state.landingType = action.payload.landingType
      if (state.autoplayCount != null && state.autoplayCount > 0) {
        state.autoplayCount -= 1
      }
    },
    resetGame: (state) => {
      state.isPlaying = false
      state.finalResult = null
      state.landingType = null
    },
    setAutoplayCount: (state, action: PayloadAction<number | null>) => {
      state.autoplayCount = action.payload
    },
    stopAutoplay: (state) => {
      state.autoplayCount = null
    },
  },
})

export const {
  startGame,
  endGame,
  resetGame,
  setAutoplayCount,
  stopAutoplay,
} = roundSlice.actions
export default roundSlice.reducer
