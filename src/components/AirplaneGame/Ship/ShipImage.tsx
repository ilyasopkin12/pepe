import type { Position } from '../../../types/game.types'
import styles from './ShipImage.module.scss'

interface ShipProps {
  position: Position
  width: number
  height: number
  variant?: 'loss' | 'win'
}

export default function ShipImage({ position, width, height, variant }: ShipProps) {
  return (
    <div
      className={`${styles['ship-image']} ${variant ? styles[`ship-image--${variant}`] : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <img 
        src="/shipsvg.svg" 
        alt="Ship" 
        className={styles['ship-image__img']}
        onLoad={() => console.log('✅ Ship SVG loaded from refs!')}
        onError={() => console.error('❌ Ship SVG not found! Check /shipsvg.svg')}
      />
    </div>
  )
}
