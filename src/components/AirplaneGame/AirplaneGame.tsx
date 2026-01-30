import { useSelector } from 'react-redux'
import { selectGameFlat } from '../../store/game'
import BettingPanel from './BettingPanel/BettingPanel'
import AutoplayPanel from './AutoplayPanel/AutoplayPanel'
import GameCanvas from './GameCanvas/GameCanvas'
import WinScreen from './WinScreen/WinScreen'
import styles from './AirplaneGame.module.scss'

export default function AirplaneGame() {
  const { isPlaying, finalResult, isDemo, currentBalance, demoBalance } = useSelector(selectGameFlat)
  const balance = isDemo ? demoBalance : currentBalance
  const currency = isDemo ? 'FUN' : 'TON'

  return (
    <div className={styles['airplane-game']}>
      <div className={styles['airplane-game__container']}>
        <div className={styles['airplane-game__balance-badge']}>
          <span className={styles['airplane-game__balance-label']}>
            {isDemo ? 'Demo' : 'Баланс'}:
          </span>
          <span className={styles['airplane-game__balance-value']}>
            {balance.toFixed(2)} {currency}
          </span>
        </div>

        <GameCanvas />

        {!isPlaying && (
          <div className={styles['airplane-game__controls']}>
            <BettingPanel />
            <AutoplayPanel />
          </div>
        )}

        {finalResult !== null && <WinScreen />}
      </div>
    </div>
  )
}
