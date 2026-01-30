import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Position } from '../../../types/game.types'
import styles from './Explosion.module.scss'

interface ExplosionProps {
  id: string
  position: Position
  type: 'bonus' | 'torpedo'
  onComplete: (id: string) => void
}

export default function Explosion({ id, position, type, onComplete }: ExplosionProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete(id)
    }, 600)

    return () => clearTimeout(timer)
  }, [id, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`${styles.explosion} ${styles[`explosion--${type}`]}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {type === 'torpedo' && (
        <img 
          src={`${import.meta.env.BASE_URL}explosion.png`}
          alt="Explosion" 
          className={styles['explosion__image']}
        />
      )}
      
      {type === 'bonus' && (
        <>
          <div className={`${styles['explosion__ring']} ${styles['explosion__ring--1']}`} />
          <div className={`${styles['explosion__ring']} ${styles['explosion__ring--2']}`} />
          <div className={`${styles['explosion__ring']} ${styles['explosion__ring--3']}`} />
          <div className={styles['explosion__particles']}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={styles['explosion__particle']}
                style={{ '--angle': `${i * 45}deg` } as unknown as CSSProperties}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
