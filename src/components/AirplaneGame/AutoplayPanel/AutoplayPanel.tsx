import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAutoplayCount, stopAutoplay, selectGameFlat } from '../../../store/game'
import { AUTOPLAY_OPTIONS } from '../../../utils/constants'
import styles from './AutoplayPanel.module.scss'

export default function AutoplayPanel() {
  const dispatch = useDispatch()
  const { autoplayCount, isPlaying } = useSelector(selectGameFlat)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSelectCount = (count: number) => {
    dispatch(setAutoplayCount(count))
    setIsExpanded(false)
  }

  const handleStop = () => {
    dispatch(stopAutoplay())
  }

  const handleToggleExpand = () => {
    if (!isPlaying) {
      setIsExpanded(!isExpanded)
    }
  }

  if (autoplayCount && autoplayCount > 0 && isPlaying) {
    return (
      <div className={`${styles['autoplay-panel']} ${styles['autoplay-panel--compact']}`}>
        <div className={styles['autoplay-panel__info']}>
          <span className={styles['autoplay-panel__label']}>Autoplay</span>
          <span className={styles['autoplay-panel__count']}>{autoplayCount}</span>
        </div>
        <button className={styles['autoplay-panel__stop']} onClick={handleStop}>
          STOP
        </button>
      </div>
    )
  }

  return (
    <div
      className={`${styles['autoplay-panel']} ${isExpanded ? styles['autoplay-panel--expanded'] : ''}`}
    >
      <button
        className={styles['autoplay-panel__toggle']}
        onClick={handleToggleExpand}
        disabled={isPlaying}
      >
        <span className={styles['autoplay-panel__toggle-text']}>
          {autoplayCount ? `Autoplay: ${autoplayCount}` : 'Autoplay'}
        </span>
        <span className={styles['autoplay-panel__toggle-icon']}>
          {isExpanded ? '▼' : '▲'}
        </span>
      </button>

      {isExpanded && (
        <div className={styles['autoplay-panel__options']}>
          <div className={styles['autoplay-panel__title']}>Выберите количество игр:</div>
          <div className={styles['autoplay-panel__buttons']}>
            {AUTOPLAY_OPTIONS.map((count) => (
              <button
                key={count}
                className={`${styles['autoplay-panel__option']} ${
                  autoplayCount === count ? styles.active : ''
                }`}
                onClick={() => handleSelectCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
          {autoplayCount && (
            <button
              className={styles['autoplay-panel__clear']}
              onClick={() => dispatch(setAutoplayCount(null))}
            >
              Отменить автоплей
            </button>
          )}
        </div>
      )}
    </div>
  )
}
