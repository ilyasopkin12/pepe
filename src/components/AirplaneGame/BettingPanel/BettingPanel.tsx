import { useDispatch, useSelector } from 'react-redux'
import { setBetAmount, startGame, setIsDemo, selectGameFlat } from '../../../store/game'
import { MIN_BET, MAX_BET, BET_STEPS, DEFAULT_BET_STEP } from '../../../utils/constants'
import styles from './BettingPanel.module.scss'

export default function BettingPanel() {
  const dispatch = useDispatch()
  const { betAmount, currentBalance, demoBalance, isDemo, isPlaying } = useSelector(selectGameFlat)

  const balance = isDemo ? demoBalance : currentBalance
  const canPlay = balance >= betAmount && !isPlaying

  const handleIncrease = (step: number) => {
    const newAmount = Math.min(betAmount + step, MAX_BET, balance)
    dispatch(setBetAmount(newAmount))
  }

  const handleDecrease = (step: number) => {
    const newAmount = Math.max(betAmount - step, MIN_BET)
    dispatch(setBetAmount(newAmount))
  }

  const handleStepClick = (step: number) => {
    const newAmount = Math.min(step, MAX_BET, balance)
    dispatch(setBetAmount(Math.max(newAmount, MIN_BET)))
  }

  const handlePlay = () => {
    if (canPlay) {
      dispatch(startGame())
    }
  }

  const toggleDemo = () => {
    dispatch(setIsDemo(!isDemo))
  }

  return (
    <div className={styles['betting-panel']}>
      <div className={styles['betting-panel__amount']}>
        <button
          className={styles['betting-panel__control']}
          onClick={() => handleDecrease(DEFAULT_BET_STEP)}
          disabled={betAmount <= MIN_BET || isPlaying}
          aria-label={`Уменьшить на ${DEFAULT_BET_STEP}`}
        >
          −
        </button>
        
        <div className={styles['betting-panel__value']}>
          <span className={styles['betting-panel__value-number']}>{betAmount}</span>
          <span className={styles['betting-panel__value-currency']}>{isDemo ? 'FUN' : 'TON'}</span>
          <span className={styles['betting-panel__value-step']}>(шаг ±{DEFAULT_BET_STEP})</span>
        </div>
        
        <button
          className={styles['betting-panel__control']}
          onClick={() => handleIncrease(DEFAULT_BET_STEP)}
          disabled={betAmount >= MAX_BET || betAmount >= balance || isPlaying}
          aria-label={`Увеличить на ${DEFAULT_BET_STEP}`}
        >
          +
        </button>
      </div>

      <div className={styles['betting-panel__steps']}>
        {BET_STEPS.map((step) => (
          <button
            key={step}
            className={`${styles['betting-panel__step']} ${betAmount === step ? styles.active : ''}`}
            onClick={() => handleStepClick(step)}
            disabled={step > balance || isPlaying}
          >
            {step} {isDemo ? 'FUN' : 'TON'}
          </button>
        ))}
      </div>

      <div className={styles['betting-panel__actions']}>
        <button
          className={styles['betting-panel__play']}
          onClick={handlePlay}
          disabled={!canPlay}
        >
          {balance < betAmount ? 'Недостаточно средств' : 'Играть'}
        </button>
        
        <button
          className={`${styles['betting-panel__demo']} ${isDemo ? styles.active : ''}`}
          onClick={toggleDemo}
          disabled={isPlaying}
        >
          Demo
        </button>
      </div>
    </div>
  )
}
