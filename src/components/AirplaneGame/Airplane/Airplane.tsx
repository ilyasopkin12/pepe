import type { Position } from '../../../types/game.types'
import { GamePhase } from '../../../types/game.types'
import styles from './Airplane.module.scss'

interface AirplaneProps {
  position: Position
  phase: GamePhase
  rotation?: number
}

export default function Airplane({ position, phase, rotation = 0 }: AirplaneProps) {
  const getPhaseClass = () => {
    switch (phase) {
      case GamePhase.TAKEOFF:
        return styles['airplane--takeoff']
      case GamePhase.FLYING:
        return styles['airplane--flying']
      case GamePhase.LANDING:
        return styles['airplane--landing']
      case GamePhase.CRASHED:
        return styles['airplane--crashed']
      default:
        return styles['airplane--idle']
    }
  }

  return (
    <div
      className={`${styles.airplane} ${getPhaseClass()}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <svg
        className={styles['airplane__svg']}
        width="120"
        height="80"
        viewBox="0 0 120 80"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <g className={styles['airplane__propeller']}>
          <line x1="15" y1="40" x2="35" y2="40" stroke="#FFA500" strokeWidth="3" opacity="0.8" />
          <line x1="25" y1="30" x2="25" y2="50" stroke="#FFA500" strokeWidth="3" opacity="0.8" />
          <circle cx="25" cy="40" r="4" fill="#808080" stroke="#606060" strokeWidth="1" />
        </g>

        <ellipse cx="60" cy="40" rx="35" ry="18" fill="url(#fuselageGradient)" stroke="#4A2D75" strokeWidth="2" />
        
        <ellipse cx="55" cy="35" rx="12" ry="8" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
        
        <ellipse cx="60" cy="30" rx="40" ry="6" fill="url(#wingGradient)" stroke="#4A2D75" strokeWidth="2" />
        
        <ellipse cx="60" cy="50" rx="25" ry="5" fill="url(#wingGradient)" stroke="#4A2D75" strokeWidth="1.5" />
        
        <path d="M 90 40 L 105 35 L 105 45 Z" fill="url(#wingGradient)" stroke="#4A2D75" strokeWidth="2" />
        <path d="M 100 30 L 105 25 L 105 35 Z" fill="url(#wingGradient)" stroke="#4A2D75" strokeWidth="1.5" />
        
        <line x1="45" y1="40" x2="85" y2="40" stroke="#4682B4" strokeWidth="2" />
        
        <circle cx="50" cy="32" r="8" fill="#F5DEB3" stroke="#C4A570" strokeWidth="1" />
        <circle cx="47" cy="32" r="2" fill="#9370DB" />
        <circle cx="53" cy="32" r="2" fill="#9370DB" />
        <path d="M 48 36 Q 50 38 52 36" stroke="#E91E63" strokeWidth="1.5" fill="none" />
        
        <line x1="60" y1="55" x2="60" y2="65" stroke="#2C2C2C" strokeWidth="2" />
        <circle cx="60" cy="67" r="3" fill="#1A1A1A" stroke="#4A4A4A" strokeWidth="1" />
        
        <defs>
          <linearGradient id="fuselageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9370DB" />
            <stop offset="50%" stopColor="#7A5AAD" />
            <stop offset="100%" stopColor="#6B4C9A" />
          </linearGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9370DB" />
            <stop offset="100%" stopColor="#7A5AAD" />
          </linearGradient>
        </defs>
      </svg>

      {phase === GamePhase.FLYING && (
        <div className={styles['airplane__trail']} />
      )}
    </div>
  )
}
