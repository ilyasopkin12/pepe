export { default as gameReducer } from './gameReducer'

export { setBetAmount, setIsDemo } from './sessionSlice'
export {
  startGame,
  endGame,
  resetGame,
  setAutoplayCount,
  stopAutoplay,
} from './roundSlice'
export { collectBonus, hitTorpedo } from './flightSlice'
export { setSpeed } from './settingsSlice'

export * from './gameSelectors'
export { playGameApi, stopAutoplayApi } from './gameApi'
