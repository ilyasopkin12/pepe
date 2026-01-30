import { combineReducers } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import roundReducer from './roundSlice'
import flightReducer from './flightSlice'
import settingsReducer from './settingsSlice'

const gameReducer = combineReducers({
  session: sessionReducer,
  round: roundReducer,
  flight: flightReducer,
  settings: settingsReducer,
})

export default gameReducer
