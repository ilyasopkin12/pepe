import type { Torpedo as TorpedoType } from '../../../types/game.types'
import styles from './Torpedo.module.scss'

interface TorpedoProps {
  torpedo: TorpedoType
}

export default function Torpedo({ torpedo }: TorpedoProps) {
  if (torpedo.hit) return null

  return (
    <div
      className={styles.torpedo}
      style={{
        left: `${torpedo.position.x}px`,
        top: `${torpedo.position.y}px`,
      }}
    >
      <img 
        src={`${import.meta.env.BASE_URL}bombs.png`}
        alt="Torpedo" 
        className={styles['torpedo__image']}
      />
      <div className={styles['torpedo__body']} style={{ display: 'none' }}>
        <div className={styles['torpedo__head']} />
        <div className={styles['torpedo__stripe']} />
        <div className={styles['torpedo__fins']}>
          <div className={`${styles['torpedo__fin']} ${styles['torpedo__fin--top']}`} />
          <div className={`${styles['torpedo__fin']} ${styles['torpedo__fin--bottom']}`} />
        </div>
        <div className={styles['torpedo__propeller']} />
      </div>
      <div className={styles['torpedo__bubbles']}>
        <div className={styles['torpedo__bubble']} />
        <div className={styles['torpedo__bubble']} />
        <div className={styles['torpedo__bubble']} />
      </div>
    </div>
  )
}
