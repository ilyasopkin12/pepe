import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type GameSpeed = 'normal' | 'fast'

export interface SettingsState {
  speed: GameSpeed
}

const initialState: SettingsState = {
  speed: 'normal',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<GameSpeed>) => {
      state.speed = action.payload
    },
  },
})

export const { setSpeed } = settingsSlice.actions
export default settingsSlice.reducer
