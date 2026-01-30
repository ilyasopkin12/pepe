import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_BET } from '../../utils/constants'
import { startGame, endGame } from './roundSlice'

export interface SessionState {
  betAmount: number
  currentBalance: number
  demoBalance: number
  isDemo: boolean
}

export const initialSessionState: SessionState = {
  betAmount: DEFAULT_BET,
  currentBalance: 100,
  demoBalance: 1000,
  isDemo: false,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialSessionState,
  reducers: {
    setBetAmount: (state, action: PayloadAction<number>) => {
      state.betAmount = action.payload
    },
    setIsDemo: (state, action: PayloadAction<boolean>) => {
      state.isDemo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame, (state) => {
        if (!state.isDemo) {
          state.currentBalance -= state.betAmount
        }
      })
      .addCase(endGame, (state, action) => {
        if (!state.isDemo) {
          state.currentBalance += action.payload.result
        } else {
          state.demoBalance += action.payload.result - state.betAmount
        }
      })
  },
})

export const { setBetAmount, setIsDemo } = sessionSlice.actions
export default sessionSlice.reducer
