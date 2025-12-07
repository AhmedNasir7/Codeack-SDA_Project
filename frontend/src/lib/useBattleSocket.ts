import { useEffect, useState, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

interface UseBattleSocketProps {
  tournamentId: string
  userId: number
  enabled: boolean
}

export interface BattleUpdate {
  users: Array<{ userId: number; socketId: string; completedCount: number }>
  userCount: number
  opponentFound: boolean
}

export const useBattleSocket = ({
  tournamentId,
  userId,
  enabled,
}: UseBattleSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [battleUpdate, setBattleUpdate] = useState<BattleUpdate | null>(null)
  const [opponentCompletedCount, setOpponentCompletedCount] = useState(0)
  const [battleWinner, setBattleWinner] = useState<any>(null)
  const [battleResults, setBattleResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    console.log('[SOCKET HOOK] Effect running. enabled:', enabled, 'tournamentId:', tournamentId, 'userId:', userId)
    
    if (!enabled || !tournamentId || !userId) {
      console.log('[SOCKET HOOK] Returning early - not enabled or missing params')
      return
    }

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      console.log(`[SOCKET] Connecting to ${API_BASE_URL}, userId: ${userId}, tournamentId: ${tournamentId}`)
      
      // Create socket connection to the default namespace
      const newSocket = io(API_BASE_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      socketRef.current = newSocket

      // Set up all event listeners FIRST, before connecting
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id)
        setIsConnected(true)
        setError(null)

        // Join battle room
        console.log(`Emitting joinBattle for tournament ${tournamentId}, user ${userId}`)
        newSocket.emit('joinBattle', {
          tournamentId: parseInt(tournamentId),
          userId,
        })
      })

      newSocket.on('connect_error', (error: any) => {
        console.error('[SOCKET] Connection error:', error)
        setError(`Connection error: ${error.message}`)
      })

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected')
        setIsConnected(false)
      })

      newSocket.on('battleUpdate', (data: BattleUpdate) => {
        console.log('[SOCKET] Battle update received:', data)
        console.log('[SOCKET] opponentFound:', data.opponentFound)
        console.log('[SOCKET] userCount:', data.userCount)
        console.log('[SOCKET] users:', data.users)
        setBattleUpdate(data)

        // If opponent found, extract their info
        if (data.users && data.users.length > 1) {
          const opponent = data.users.find((u) => u.userId !== userId)
          if (opponent) {
            console.log('[SOCKET] Opponent found:', opponent)
            setOpponentCompletedCount(opponent.completedCount)
          }
        }
      })

      newSocket.on('questionMarked', (data: any) => {
        console.log('Question marked:', data)
        if (data.userId !== userId) {
          setOpponentCompletedCount(data.completedCount)
        }
      })

      newSocket.on('battleWon', (data: any) => {
        console.log('Battle won:', data)
        setBattleWinner(data.winnerId)
      })

      newSocket.on('battleResults', (data: any) => {
        console.log('Battle results:', data)
        setBattleResults(data)
      })

      newSocket.on('opponentDisconnected', (data: any) => {
        console.log('Opponent disconnected:', data)
        setError(data.message)
      })

      newSocket.on('error', (err: any) => {
        console.error('Socket error:', err)
        setError(err?.message || 'Socket connection error')
      })

      setSocket(newSocket)

      return () => {
        newSocket.emit('leaveBattle', { tournamentId: parseInt(tournamentId) })
        newSocket.disconnect()
      }
    } catch (err) {
      console.error('Failed to create socket:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect socket')
    }
  }, [enabled, tournamentId, userId])

  const markComplete = (questionId: number) => {
    if (socket && isConnected) {
      socket.emit('markComplete', {
        tournamentId: parseInt(tournamentId),
        userId,
        questionId,
      })
    }
  }

  const submitResult = (
    opponentId: number,
    userScore: number,
    opponentScore: number,
    winnerId: number
  ) => {
    if (socket && isConnected) {
      socket.emit('submitResult', {
        tournamentId: parseInt(tournamentId),
        userId,
        opponentId,
        userScore,
        opponentScore,
        winnerId,
      })
    }
  }

  return {
    socket,
    isConnected,
    battleUpdate,
    opponentCompletedCount,
    battleWinner,
    battleResults,
    error,
    markComplete,
    submitResult,
  }
}
