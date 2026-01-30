import { configureStore } from '@reduxjs/toolkit'
import { gameReducer } from './game'
import { initialSessionState } from './game/sessionSlice'

const SESSION_STORAGE_KEY = 'airplane-game-session'

export type RootState = { game: ReturnType<typeof gameReducer> }

type PersistedSessionState = Pick<typeof initialSessionState, 'currentBalance' | 'demoBalance' | 'isDemo'>

const loadSessionState = (): PersistedSessionState | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedSessionState
    return parsed
  } catch {
    return null
  }
}

const saveSessionState = (state: PersistedSessionState) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
  } catch {
  }
}

const persistedSession = loadSessionState()
const preloadedState = persistedSession
  ? {
      game: {
        session: {
          ...initialSessionState,
          ...persistedSession,
        },
      },
    }
  : undefined

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  ...(preloadedState && { preloadedState }),
})

export type AppDispatch = typeof store.dispatch

store.subscribe(() => {
  const state = store.getState()
  saveSessionState({
    currentBalance: state.game.session.currentBalance,
    demoBalance: state.game.session.demoBalance,
    isDemo: state.game.session.isDemo,
  })
})
