import type { Position } from '../../../types/game.types'
import styles from './Ship.module.scss'

interface ShipProps {
  position: Position
  width: number
  height: number
}

export default function Ship({ position, width, height }: ShipProps) {
  return (
    <div
      className={styles.ship}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className={styles['ship__body']}>
        <div className={styles['ship__deck']} />
        <div className={styles['ship__bridge']}>
          <div className={styles['ship__tower']} />
          <div className={styles['ship__antenna']} />
        </div>
        <div className={styles['ship__hull']} />
      </div>
      <div className={styles['ship__shadow']} />
    </div>
  )
}
