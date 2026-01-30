import type { Position } from '../../../types/game.types'
import { GamePhase } from '../../../types/game.types'
import styles from './AirplaneImage.module.scss'

interface AirplaneProps {
  position: Position
  phase: GamePhase
  rotation?: number
  isLandingOnShip?: boolean
}

export default function AirplaneImage({ position, phase, rotation = 0, isLandingOnShip = false }: AirplaneProps) {
  const getPhaseClass = () => {
    switch (phase) {
      case GamePhase.TAKEOFF:
        return styles['airplane-img--takeoff']
      case GamePhase.FLYING:
        return styles['airplane-img--flying']
      case GamePhase.LANDING:
        return styles['airplane-img--landing']
      case GamePhase.CRASHED:
        return styles['airplane-img--crashed']
      default:
        return styles['airplane-img--idle']
    }
  }

  const airplaneImagePath = `${import.meta.env.BASE_URL}airplane.png`

  const content = (
    <div className={styles['airplane-img__container']}>
        <img 
          src={airplaneImagePath} 
          alt="Airplane" 
          className={styles['airplane-img__image']}
          onLoad={() => console.log('✅ Airplane image loaded!')}
          onError={() => {
            console.error('❌ Airplane image not found at:', airplaneImagePath)
          }}
        />
        <svg width="40" height="40" viewBox="0 0 40 40" className={styles['airplane-img__propeller-svg']} style={{ position: 'absolute', left: '5px', top: '45%', transform: 'translateY(-50%)', zIndex: 100 }}>
          <g className={styles['airplane-img__propeller']} transform="translate(20, 20)">
            <ellipse cx="0" cy="0" rx="18" ry="2" fill="#FF6B35" opacity="0.8" />
            <ellipse cx="0" cy="0" rx="2" ry="18" fill="#FFA500" opacity="0.8" />
            <circle cx="0" cy="0" r="4" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
          </g>
        </svg>
        
        <svg width="150" height="100" viewBox="0 0 150 100" className={styles['airplane-img__svg']} style={{ display: 'none' }}>
          <g className={styles['airplane-img__propeller']} transform="translate(15, 50)">
            <ellipse cx="0" cy="0" rx="25" ry="3" fill="#FF6B35" opacity="0.7" />
            <ellipse cx="0" cy="0" rx="3" ry="25" fill="#FFA500" opacity="0.7" />
            <circle cx="0" cy="0" r="5" fill="#C0C0C0" stroke="#808080" strokeWidth="1" />
          </g>
          
          <ellipse cx="75" cy="65" rx="45" ry="8" fill="#9370DB" stroke="#4A2D75" strokeWidth="2" />
          
          <ellipse cx="75" cy="50" rx="55" ry="20" fill="#7A5AAD" stroke="#4A2D75" strokeWidth="3" />
          
          <line x1="40" y1="50" x2="100" y2="50" stroke="#4682B4" strokeWidth="3" />
          <line x1="45" y1="56" x2="95" y2="56" stroke="#4682B4" strokeWidth="2" opacity="0.6" />
          
          <ellipse cx="75" cy="35" rx="50" ry="10" fill="#9370DB" stroke="#4A2D75" strokeWidth="2.5" />
          
          <ellipse cx="65" cy="43" rx="18" ry="12" fill="rgba(106, 76, 154, 0.6)" stroke="#4A2D75" strokeWidth="2" />
          <ellipse cx="65" cy="40" rx="15" ry="9" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          
          <g className={styles['airplane-img__pilot']}>
            <ellipse cx="60" cy="35" rx="11" ry="12" fill="#F5DEB3" stroke="#C4A570" strokeWidth="1.5" />
            <ellipse cx="57" cy="34" rx="3" ry="4" fill="#9370DB" />
            <ellipse cx="63" cy="34" rx="3" ry="4" fill="#9370DB" />
            <circle cx="57" cy="33" r="1.5" fill="white" />
            <circle cx="63" cy="33" r="1.5" fill="white" />
            <path d="M 56 39 Q 60 42 64 39" stroke="#E91E63" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          
          <path d="M 120 50 L 140 45 L 140 55 Z" fill="#7A5AAD" stroke="#4A2D75" strokeWidth="2" />
          <path d="M 135 35 L 145 28 L 145 42 Z" fill="#9370DB" stroke="#4A2D75" strokeWidth="2" />
          
          <line x1="70" y1="68" x2="70" y2="80" stroke="#2C2C2C" strokeWidth="3" />
          <line x1="85" y1="68" x2="85" y2="80" stroke="#2C2C2C" strokeWidth="3" />
          
          <circle cx="70" cy="82" r="5" fill="#1A1A1A" stroke="#4A4A4A" strokeWidth="1.5" />
          <circle cx="85" cy="82" r="5" fill="#1A1A1A" stroke="#4A4A4A" strokeWidth="1.5" />
        </svg>
        
        {(phase === GamePhase.FLYING || phase === GamePhase.TAKEOFF) && (
          <div className={styles['airplane-img__trail']} />
        )}
    </div>
  )

  return (
    <div
      className={`${styles['airplane-img']} ${getPhaseClass()} ${
        isLandingOnShip ? styles['airplane-img--landing-on-ship'] : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: phase === GamePhase.CRASHED ? 'rotate(80deg)' : `rotate(${rotation}deg)`,
      }}
    >
      {content}
    </div>
  )
}
