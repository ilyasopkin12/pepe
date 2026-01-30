import type { Bonus as BonusType } from '../../../types/game.types'
import { BonusType as BonusTypeEnum } from '../../../types/game.types'
import styles from './Bonus.module.scss'

interface BonusProps {
  bonus: BonusType
}

export default function Bonus({ bonus }: BonusProps) {
  if (bonus.collected) return null

  const isMultiplicative = bonus.type === BonusTypeEnum.MULTIPLICATIVE

  return (
    <div
      className={`${styles.bonus} ${
        isMultiplicative ? styles['bonus--multiplicative'] : styles['bonus--additive']
      }`}
      style={{
        left: `${bonus.position.x}px`,
        top: `${bonus.position.y}px`,
      }}
    >
      <div className={styles['bonus__glow']} />
      <div className={styles['bonus__star']}>
        <div className={styles['bonus__star-inner']} />
      </div>
      <div className={styles['bonus__value']}>
        {isMultiplicative ? `x${bonus.value}` : `+${bonus.value}`}
      </div>
    </div>
  )
}
