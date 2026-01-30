import { useEffect, useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { Position } from '../../../types/game.types'
import {
  collectBonus,
  hitTorpedo,
  endGame,
  setSpeed as setGameSpeed,
  selectGameFlat,
} from '../../../store/game'
import { GamePhase, LandingType } from '../../../types/game.types'
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  AIRPLANE_START_X,
  FLIGHT_FLOOR_Y,
  SHIP_WIDTH, 
  SHIP_HEIGHT, 
  SHIP_X,
  SHIP_Y,
  SHIP_2_X,
  SHIP_2_Y,
  LANDING_SHIP_2_X,
  LANDING_SHIP_2_Y,
  SPEED_NORMAL, 
  SPEED_FAST,
} from '../../../utils/constants'
import { playGameApi } from '../../../store/game/gameApi'
import useGameLoop from '../hooks/useGameLoop'
import useAirplane from '../hooks/useAirplane'
import useBonuses from '../hooks/useBonuses'
import useTorpedoes from '../hooks/useTorpedoes'
import ShipImage from '../Ship/ShipImage'
import AirplaneImage from '../Airplane/AirplaneImage'
import Bonus from '../Bonus/Bonus'
import Torpedo from '../Torpedo/Torpedo'
import Explosion from '../Explosion/Explosion'
import styles from './GameCanvas.module.scss'

export default function GameCanvas() {
  const dispatch = useDispatch()
  const { isPlaying, betAmount, isDemo, speed, currentMultiplier, finalResult } = useSelector(selectGameFlat)
  const currency = isDemo ? 'FUN' : 'TON'

  const airplane = useAirplane()
  const bonuses = useBonuses()
  const torpedoes = useTorpedoes()

  const airplaneRef = useRef(airplane)
  const bonusesRef = useRef(bonuses)
  const torpedoesRef = useRef(torpedoes)
  airplaneRef.current = airplane
  bonusesRef.current = bonuses
  torpedoesRef.current = torpedoes

  const spawnCounterRef = useRef(0)
  const gameResultRef = useRef<Awaited<ReturnType<typeof playGameApi>> | null>(null)
  const [explosions, setExplosions] = useState<Array<{ id: string; position: Position; type: 'bonus' | 'torpedo' }>>([])
  const explosionIdRef = useRef(0)
  const gameEndedRef = useRef(false)
  const crashEndTimeoutRef = useRef<number | null>(null)
  const prevIsPlayingRef = useRef(isPlaying)
  const prevFinalResultRef = useRef<number | null>(finalResult)
  const justResetRef = useRef(false)
  const [landingTargetPosition, setLandingTargetPosition] = useState<Position | null>(null)
  const [useLandingTargetPosition, setUseLandingTargetPosition] = useState(false)
  const landingRafRef = useRef<number | null>(null)
  const [cameraOffset, setCameraOffset] = useState(0)
  const effectiveCameraOffset = isPlaying ? cameraOffset : 0
  const [dynamicClouds, setDynamicClouds] = useState<Array<{ id: number; x: number; y: number; type: 1 | 2 }>>([])
  const cloudIdRef = useRef(0)
  const collisionCountRef = useRef(0)
  const lastForcedSpawnAtRef = useRef(0)

  useEffect(() => {
    const hadResult = prevFinalResultRef.current !== null
    const justClosedResult = finalResult === null && hadResult
    if (justClosedResult) {
      if (landingRafRef.current !== null) {
        window.cancelAnimationFrame(landingRafRef.current)
        landingRafRef.current = null
      }
      if (crashEndTimeoutRef.current !== null) {
        window.clearTimeout(crashEndTimeoutRef.current)
        crashEndTimeoutRef.current = null
      }
      airplane.reset()
      bonuses.reset()
      torpedoes.reset()
      setExplosions([])
      setDynamicClouds([])
      setCameraOffset(0)
      setLandingTargetPosition(null)
      setUseLandingTargetPosition(false)
      spawnCounterRef.current = 0
      gameEndedRef.current = false
      collisionCountRef.current = 0
      lastForcedSpawnAtRef.current = 0
    }
    prevFinalResultRef.current = finalResult
  }, [finalResult])

  useEffect(() => {
    const justStartedPlaying = isPlaying && !prevIsPlayingRef.current
    if (justStartedPlaying) {
      if (landingRafRef.current !== null) {
        window.cancelAnimationFrame(landingRafRef.current)
        landingRafRef.current = null
      }
      if (crashEndTimeoutRef.current !== null) {
        window.clearTimeout(crashEndTimeoutRef.current)
        crashEndTimeoutRef.current = null
      }
      justResetRef.current = true
      airplane.reset()
      bonuses.reset()
      torpedoes.reset()
      setExplosions([])
      setDynamicClouds([])
      setCameraOffset(0)
      setLandingTargetPosition(null)
      setUseLandingTargetPosition(false)
      spawnCounterRef.current = 0
      gameEndedRef.current = false
      collisionCountRef.current = 0
      lastForcedSpawnAtRef.current = 0
    }
    prevIsPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying || airplane.phase !== GamePhase.IDLE) return
    if (justResetRef.current) {
      justResetRef.current = false
    }
    airplane.startTakeoff()
    playGameApi(betAmount, isDemo).then((result) => {
      gameResultRef.current = result
    })
  }, [isPlaying, airplane.phase, airplane.startTakeoff, betAmount, isDemo])

  useEffect(() => {
    if (airplane.phase !== GamePhase.LANDING || !landingTargetPosition) {
      setUseLandingTargetPosition(false)
      return
    }
    if (useLandingTargetPosition) return
    landingRafRef.current = window.requestAnimationFrame(() => {
      setUseLandingTargetPosition(true)
      landingRafRef.current = null
    })
  }, [airplane.phase, landingTargetPosition, useLandingTargetPosition])

  const handleUpdate = useCallback(
    (deltaTime: number) => {
      const plane = airplaneRef.current
      const bonus = bonusesRef.current
      const torp = torpedoesRef.current
      const phase: GamePhase = plane.phase
      const phaseForChecks: GamePhase = plane.phase

      if (!isPlaying) return
      if (phase === GamePhase.FINISHED) return

      spawnCounterRef.current += deltaTime
      if (spawnCounterRef.current > 0.05) {
        bonus.spawnBonus(plane.position.x)
        torp.spawnTorpedo(plane.position.x)
        if (Math.random() < 0.2) {
          setDynamicClouds(prev => [...prev, {
            id: cloudIdRef.current++,
            x: plane.position.x + 600,
            y: Math.random() * 400 + 50,
            type: Math.random() > 0.5 ? 1 : 2,
          }])
        }
        spawnCounterRef.current = 0
      }

      setDynamicClouds(prev => prev.filter(cloud => cloud.x > plane.position.x - 800))

      const collectedBonus = bonus.checkCollisions(plane.position)
      const hitByTorpedo = torp.checkCollisions(plane.position)

      if (collectedBonus) {
        dispatch(collectBonus({ bonus: collectedBonus, betAmount }))
        collisionCountRef.current += 1
        setExplosions(prev => [...prev, {
          id: `exp-${explosionIdRef.current++}`,
          position: { ...collectedBonus.position },
          type: 'bonus'
        }])
      }

      if (hitByTorpedo) {
        dispatch(hitTorpedo())
        collisionCountRef.current += 1
        setExplosions(prev => [...prev, {
          id: `exp-${explosionIdRef.current++}`,
          position: { ...plane.position },
          type: 'torpedo'
        }])
      }

      if (plane.update) {
        plane.update(deltaTime, !!collectedBonus, hitByTorpedo, gameResultRef.current?.landingType ?? null)
      }

      const shouldForceCollisions =
        collisionCountRef.current < 4 &&
        phaseForChecks !== GamePhase.LANDING &&
        phaseForChecks !== GamePhase.CRASHED &&
        phaseForChecks !== GamePhase.FINISHED &&
        plane.position.x > AIRPLANE_START_X + 200

      if (shouldForceCollisions && performance.now() - lastForcedSpawnAtRef.current > 900) {
        const forcedPosition = { x: plane.position.x + 40, y: plane.position.y }
        bonus.spawnBonusAt(forcedPosition)
        lastForcedSpawnAtRef.current = performance.now()
      }

      const shouldForceWinLanding =
        gameResultRef.current?.landingType === LandingType.SHIP_WIN &&
        phaseForChecks !== GamePhase.LANDING &&
        phaseForChecks !== GamePhase.CRASHED &&
        plane.position.x > AIRPLANE_START_X + 900

      if (shouldForceWinLanding && plane.forceLanding) {
        plane.forceLanding()
      }

      torp.update(deltaTime)

      const targetCameraOffset = Math.max(0, plane.position.x - CANVAS_WIDTH / 3)
      setCameraOffset(targetCameraOffset)

      if ((plane.phase === GamePhase.LANDING || plane.phase === GamePhase.CRASHED) && !gameEndedRef.current) {
        gameEndedRef.current = true
        if (plane.phase === GamePhase.LANDING) {
          const payload = gameResultRef.current ?? { result: 0, landingType: LandingType.WATER as LandingType }
          if (payload.landingType === LandingType.SHIP_WIN) {
            setLandingTargetPosition({ x: LANDING_SHIP_2_X, y: LANDING_SHIP_2_Y })
          } else {
            setLandingTargetPosition({
              x: plane.position.x + 40,
              y: FLIGHT_FLOOR_Y + 140,
            })
          }
          setTimeout(() => {
            dispatch(endGame({ result: payload.result, landingType: payload.landingType }))
          }, 800)
          gameResultRef.current = null
        } else {
          const payload = gameResultRef.current ?? { result: 0, landingType: LandingType.WATER as LandingType }
          if (crashEndTimeoutRef.current === null) {
            crashEndTimeoutRef.current = window.setTimeout(() => {
              dispatch(endGame({ result: payload.result, landingType: payload.landingType }))
              crashEndTimeoutRef.current = null
              gameResultRef.current = null
            }, 700)
          }
        }
      }
    },
    [isPlaying, dispatch]
  )

  const gameSpeed = speed === 'normal' ? SPEED_NORMAL : SPEED_FAST

  const airplaneDisplayPosition =
    airplane.phase === GamePhase.LANDING && landingTargetPosition && useLandingTargetPosition
      ? landingTargetPosition
      : airplane.position

  const removeExplosion = useCallback((id: string) => {
    setExplosions((prev) => prev.filter((e) => e.id !== id))
  }, [])

  useGameLoop({
    isActive: isPlaying,
    speed: gameSpeed,
    onUpdate: handleUpdate,
  })

  return (
    <div className={styles['game-canvas']}>
      <div className={styles['game-canvas__background']}>
        <div className={styles['game-canvas__sky']} />
        <div className={styles['game-canvas__sea']} />
      </div>

      <div
        className={styles['game-canvas__game-area']}
        style={{
          width: `${CANVAS_WIDTH * 3}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `translateX(-${effectiveCameraOffset}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {dynamicClouds.map((cloud) => (
          <div
            key={cloud.id}
            className={styles['game-canvas__dynamic-cloud']}
            style={{
              left: `${cloud.x}px`,
              top: `${cloud.y}px`,
              backgroundImage: `url(/cloud${cloud.type}.png)`,
            }}
          />
        ))}
        
        <ShipImage
          position={{ x: SHIP_X, y: SHIP_Y }}
          width={SHIP_WIDTH}
          height={SHIP_HEIGHT}
          variant="loss"
        />
        <ShipImage
          position={{ x: SHIP_2_X, y: SHIP_2_Y }}
          width={SHIP_WIDTH}
          height={SHIP_HEIGHT}
          variant="win"
        />

        {bonuses.bonuses.map((bonus) => (
          <Bonus key={bonus.id} bonus={bonus} />
        ))}

        {torpedoes.torpedoes.map((torpedo) => (
          <Torpedo key={torpedo.id} torpedo={torpedo} />
        ))}

        {explosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            id={explosion.id}
            position={explosion.position}
            type={explosion.type}
            onComplete={removeExplosion}
          />
        ))}

        {(isPlaying || airplane.phase === GamePhase.IDLE) && (
          <AirplaneImage
            position={airplaneDisplayPosition}
            phase={airplane.phase}
            rotation={airplane.phase === GamePhase.LANDING && landingTargetPosition ? 0 : airplane.rotation}
            isLandingOnShip={airplane.phase === GamePhase.LANDING && landingTargetPosition !== null}
          />
        )}
      </div>

      <div className={styles['game-canvas__speed-controls']}>
        <button
          className={`${styles['game-canvas__speed-button']} ${speed === 'normal' ? styles.active : ''}`}
          onClick={() => dispatch(setGameSpeed('normal'))}
        >
          Normal 🚶
        </button>
        <button
          className={`${styles['game-canvas__speed-button']} ${speed === 'fast' ? styles.active : ''}`}
          onClick={() => dispatch(setGameSpeed('fast'))}
        >
          Fast 🐇
        </button>
      </div>

      {isPlaying && airplane.phase !== GamePhase.IDLE && airplane.phase !== GamePhase.FINISHED && (
        <div 
          className={styles['game-canvas__airplane-balance']}
          style={{
            left: `${airplaneDisplayPosition.x + 75 - effectiveCameraOffset}px`,
            top: `${airplaneDisplayPosition.y - 40}px`,
          }}
        >
          {(betAmount * currentMultiplier).toFixed(2)} {currency}
        </div>
      )}
    </div>
  )
}
