import { useState, useCallback, useRef } from 'react'
import type { Position, Velocity } from '../../../types/game.types'
import { GamePhase, LandingType } from '../../../types/game.types'
import {
  AIRPLANE_START_X,
  AIRPLANE_START_Y,
  AIRPLANE_WIDTH,
  INITIAL_VELOCITY_X,
  INITIAL_VELOCITY_Y,
  CANVAS_WIDTH,
  GRAVITY,
  MAX_VELOCITY_Y,
  BONUS_LIFT,
  TORPEDO_DROP,
  FLIGHT_FLOOR_Y,
  LANDING_SHIP_2_X,
  SHIP_2_X,
} from '../../../utils/constants'

export default function useAirplane() {
  const [position, setPosition] = useState<Position>({
    x: AIRPLANE_START_X,
    y: AIRPLANE_START_Y,
  })
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, y: 0 })
  const [phase, setPhase] = useState<GamePhase>(GamePhase.IDLE)
  const [rotation, setRotation] = useState(0)
  const [flightTime, setFlightTime] = useState(0)

  const positionRef = useRef(position)
  const velocityRef = useRef(velocity)
  const phaseRef = useRef(phase)
  const flightTimeRef = useRef(flightTime)
  positionRef.current = position
  velocityRef.current = velocity
  phaseRef.current = phase
  flightTimeRef.current = flightTime

  const startTakeoff = useCallback(() => {
    const initialVel = { x: INITIAL_VELOCITY_X, y: INITIAL_VELOCITY_Y }
    setPhase(GamePhase.TAKEOFF)
    setVelocity(initialVel)
    setFlightTime(0)
  }, [])

  const update = useCallback((
    deltaTime: number,
    bonusCollected: boolean,
    torpedoHit: boolean,
    plannedLandingType: LandingType | null = null
  ) => {
    const pos = positionRef.current
    const vel = velocityRef.current
    const ph = phaseRef.current
    const phaseSnapshot: GamePhase = ph
    const t = flightTimeRef.current

    if (ph === GamePhase.FINISHED) return
    if (ph === GamePhase.LANDING) return

    if (ph === GamePhase.CRASHED) {
      const crashTargetY = FLIGHT_FLOOR_Y + 160
      const boostedVelY = Math.max(vel.y + GRAVITY * 6, 4)
      const crashPosY = Math.min(pos.y + boostedVelY * deltaTime * 60, crashTargetY)
      const crashPosX = Math.min(pos.x + INITIAL_VELOCITY_X * 0.3 * deltaTime * 60, SHIP_2_X - AIRPLANE_WIDTH)

      const crashPosition = { x: crashPosX, y: crashPosY }
      positionRef.current = crashPosition
      velocityRef.current = { x: 0, y: crashPosY >= crashTargetY ? 0 : boostedVelY }
      setPosition(crashPosition)
      setVelocity({ x: 0, y: crashPosY >= crashTargetY ? 0 : boostedVelY })
      setRotation(85)
      return
    }

    const newFlightTime = t + deltaTime
    flightTimeRef.current = newFlightTime
    setFlightTime(newFlightTime)

    if (ph === GamePhase.TAKEOFF && pos.y < AIRPLANE_START_Y - 80) {
      phaseRef.current = GamePhase.FLYING
      setPhase(GamePhase.FLYING)
    }

    let newVelY = vel.y + GRAVITY
    if (bonusCollected) newVelY -= BONUS_LIFT
    if (torpedoHit) newVelY += TORPEDO_DROP
    newVelY = Math.max(-MAX_VELOCITY_Y, Math.min(newVelY, MAX_VELOCITY_Y))

  const newVelocity = { x: INITIAL_VELOCITY_X, y: newVelY }

    let newPosY = pos.y + newVelocity.y * deltaTime * 60
  const maxPosX =
    plannedLandingType === LandingType.SHIP_WIN
      ? LANDING_SHIP_2_X
      : SHIP_2_X - AIRPLANE_WIDTH
  const newPosX = Math.min(pos.x + newVelocity.x * deltaTime * 60, maxPosX)
    const hasFlownEnough = newPosX > AIRPLANE_START_X + 600 && newFlightTime > 4
    const reachedEdge = newPosX >= CANVAS_WIDTH - 250

    const shouldCrash = plannedLandingType === LandingType.WATER
    const shouldHoldForResult = plannedLandingType === null
    const isCrashMoment = false
    const shouldTriggerCrash =
      shouldCrash &&
      phaseSnapshot !== GamePhase.CRASHED &&
      newFlightTime > 2 &&
      newPosX > AIRPLANE_START_X + 300

    if (shouldTriggerCrash) {
      phaseRef.current = GamePhase.CRASHED
      setPhase(GamePhase.CRASHED)
      setRotation(85)
    }
    const atOrBelowFloor = newPosY >= FLIGHT_FLOOR_Y || pos.y >= FLIGHT_FLOOR_Y
    if (hasFlownEnough && shouldCrash && atOrBelowFloor) {
      newPosY = FLIGHT_FLOOR_Y
      newVelY = 0
      phaseRef.current = GamePhase.CRASHED
      setPhase(GamePhase.CRASHED)
      setRotation(85)
    } else if (newPosY > FLIGHT_FLOOR_Y) {
      if (hasFlownEnough && shouldHoldForResult) {
        newPosY = FLIGHT_FLOOR_Y
        newVelY = 0
      } else {
        newPosY = FLIGHT_FLOOR_Y
        newVelY = 0
      }
    }

    const newPosition = { x: newPosX, y: newPosY }
    positionRef.current = newPosition
    velocityRef.current = { x: newVelocity.x, y: newVelY }
    setVelocity({ x: newVelocity.x, y: newVelY })
    setPosition(newPosition)

    const newRotation = isCrashMoment
      ? 80
      : Math.max(-30, Math.min(30, newVelY * 3))
    setRotation(newRotation)

    if (
      phaseSnapshot !== GamePhase.LANDING &&
      plannedLandingType === LandingType.SHIP_WIN &&
      hasFlownEnough &&
      reachedEdge &&
      newPosY <= FLIGHT_FLOOR_Y
    ) {
      phaseRef.current = GamePhase.LANDING
      setPhase(GamePhase.LANDING)
    }
  }, [])

  const reset = useCallback(() => {
    const startPos = { x: AIRPLANE_START_X, y: AIRPLANE_START_Y }
    const zeroVel = { x: 0, y: 0 }
    positionRef.current = startPos
    velocityRef.current = zeroVel
    phaseRef.current = GamePhase.IDLE
    flightTimeRef.current = 0
    setPosition(startPos)
    setVelocity(zeroVel)
    setPhase(GamePhase.IDLE)
    setRotation(0)
    setFlightTime(0)
  }, [])

  const forceLanding = useCallback(() => {
    phaseRef.current = GamePhase.LANDING
    setPhase(GamePhase.LANDING)
    setRotation(0)
  }, [])

  return {
    position,
    velocity,
    phase,
    rotation,
    startTakeoff,
    update,
    forceLanding,
    reset,
  }
}
