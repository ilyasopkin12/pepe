export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

export const BonusType = {
  ADDITIVE: 'additive',
  MULTIPLICATIVE: 'multiplicative',
} as const
export type BonusType = (typeof BonusType)[keyof typeof BonusType]

export interface Bonus {
  id: string
  position: Position
  type: BonusType
  value: number
  collected: boolean
}

export interface Torpedo {
  id: string
  position: Position
  velocity: Velocity
  hit: boolean
}

export const GamePhase = {
  IDLE: 'idle',
  TAKEOFF: 'takeoff',
  FLYING: 'flying',
  LANDING: 'landing',
  CRASHED: 'crashed',
  FINISHED: 'finished',
} as const
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase]

export const LandingType = {
  WATER: 'water',
  SHIP_WIN: 'ship_win',
} as const
export type LandingType = (typeof LandingType)[keyof typeof LandingType]

export interface GameStateFlat {
  betAmount: number
  currentBalance: number
  demoBalance: number
  isDemo: boolean
  isPlaying: boolean
  finalResult: number | null
  landingType: LandingType | null
  autoplayCount: number | null
  currentMultiplier: number
  collectedBonuses: Bonus[]
  hitTorpedoes: number
  speed: 'normal' | 'fast'
}

export interface GameResult {
  result: number
  balance: number
  demoBalance: number
  landingType: LandingType
}
