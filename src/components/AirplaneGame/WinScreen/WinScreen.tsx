import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetGame, startGame, selectGameFlat } from '../../../store/game'
import { WIN_MULTIPLIER_THRESHOLD } from '../../../utils/constants'
import styles from './WinScreen.module.scss'

export default function WinScreen() {
  const dispatch = useDispatch()
  const { finalResult, betAmount, landingType, autoplayCount } = useSelector(selectGameFlat)
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    const hadAutoplay = autoplayCount !== null && autoplayCount > 0
    setTimeout(() => {
      dispatch(resetGame())
      if (hadAutoplay) {
        setTimeout(() => dispatch(startGame()), 400)
      }
    }, 300)
  }, [dispatch, autoplayCount])

  useEffect(() => {
    if (finalResult !== null) {
      const showTimer = setTimeout(() => setIsVisible(true), 100)
      const closeTimer = setTimeout(() => handleClose(), 4000)
      return () => {
        clearTimeout(showTimer)
        clearTimeout(closeTimer)
      }
    }
  }, [finalResult, landingType, handleClose])

  if (finalResult === null) return null

  const multiplier = finalResult / betAmount
  const isWin = multiplier >= 1
  const isBigWin = multiplier >= WIN_MULTIPLIER_THRESHOLD
  const landing = landingType ?? 'water'

  return (
    <div className={`${styles['win-screen']} ${isVisible ? styles['win-screen--visible'] : ''}`}>
      <div className={styles['win-screen__overlay']} onClick={handleClose} />
      <div className={styles['win-screen__content']}>
        <div className={`${styles['win-screen__result']} ${isWin ? styles['win-screen__result--win'] : styles['win-screen__result--loss']}`}>
          {landing === 'water' && (
            <div className={styles['win-screen__icon']}>💧</div>
          )}
          {landing === 'ship_win' && (
            <div className={styles['win-screen__icon']}>🎉</div>
          )}

          <div className={styles['win-screen__title']}>
            {landing === 'water' && 'Упал в воду!'}
            {landing === 'ship_win' && isBigWin && 'БОЛЬШОЙ ВЫИГРЫШ!'}
            {landing === 'ship_win' && !isBigWin && 'Поздравляем!'}
          </div>

          <div className={styles['win-screen__amount']}>
            {isWin ? '+' : ''}{finalResult.toFixed(2)} TON
          </div>

          <div className={styles['win-screen__multiplier']}>
            x{multiplier.toFixed(2)}
          </div>

          {isBigWin && (
            <button className={styles['win-screen__button']} onClick={handleClose}>
              Продолжить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
