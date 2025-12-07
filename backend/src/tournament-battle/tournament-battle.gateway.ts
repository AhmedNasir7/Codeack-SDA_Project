import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable } from '@nestjs/common'

interface BattleRoom {
  tournamentId: number
  users: Map<
    string,
    { userId: number; socketId: string; completedCount: number }
  >
}

@Injectable()
@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: {
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class TournamentBattleGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server

  private battleRooms = new Map<number, BattleRoom>()

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    // Remove user from all rooms
    this.battleRooms.forEach((room, tournamentId) => {
      room.users.forEach((user, socketId) => {
        if (socketId === client.id) {
          room.users.delete(socketId)
          // Notify other user that opponent left
          this.server
            .to(`tournament-${tournamentId}`)
            .emit('opponentDisconnected', {
              message: 'Opponent left the battle',
            })
        }
      })
    })
  }

  @SubscribeMessage('joinBattle')
  handleJoinBattle(
    client: Socket,
    data: { tournamentId: number; userId: number },
  ) {
    const { tournamentId, userId } = data
    const roomName = `tournament-${tournamentId}`

    console.log(
      `[SOCKET] User ${userId} attempting to join tournament ${tournamentId}`,
    )

    // Join socket.io room
    client.join(roomName)
    console.log(`[SOCKET] User ${userId} joined room: ${roomName}`)

    // Initialize or get battle room
    if (!this.battleRooms.has(tournamentId)) {
      this.battleRooms.set(tournamentId, {
        tournamentId,
        users: new Map(),
      })
      console.log(
        `[SOCKET] Created new battle room for tournament ${tournamentId}`,
      )
    }

    const room = this.battleRooms.get(tournamentId)!
    room.users.set(client.id, {
      userId,
      socketId: client.id,
      completedCount: 0,
    })

    console.log(
      `[SOCKET] User ${userId} added to room. Total users in room: ${room.users.size}`,
    )

    // Send room state to all users
    const users = Array.from(room.users.values())
    const battleUpdateData = {
      users,
      userCount: users.length,
      opponentFound: users.length > 1,
    }

    console.log(
      `[SOCKET] Broadcasting battleUpdate to room ${roomName}:`,
      battleUpdateData,
    )
    this.server.to(roomName).emit('battleUpdate', battleUpdateData)

    return {
      status: 'joined',
      userCount: users.length,
      opponentFound: users.length > 1,
    }
  }

  @SubscribeMessage('markComplete')
  handleMarkComplete(
    client: Socket,
    data: { tournamentId: number; userId: number; questionId: number },
  ) {
    const { tournamentId, userId, questionId } = data
    const roomName = `tournament-${tournamentId}`
    const room = this.battleRooms.get(tournamentId)

    if (room && room.users.has(client.id)) {
      const user = room.users.get(client.id)!
      user.completedCount += 1

      // Broadcast update to all users in the room
      this.server.to(roomName).emit('questionMarked', {
        userId,
        completedCount: user.completedCount,
        questionId,
      })

      // Check if user won (5 questions)
      if (user.completedCount >= 5) {
        this.server.to(roomName).emit('battleWon', {
          winnerId: userId,
          winnerScore: user.completedCount,
        })
      }
    }

    return {
      status: 'marked',
      completedCount: room?.users.get(client.id)?.completedCount,
    }
  }

  @SubscribeMessage('submitResult')
  handleSubmitResult(
    client: Socket,
    data: {
      tournamentId: number
      userId: number
      opponentId: number
      userScore: number
      opponentScore: number
      winnerId: number
    },
  ) {
    const { tournamentId, userId, userScore, winnerId } = data
    const roomName = `tournament-${tournamentId}`

    // Broadcast final results to all users in the room
    this.server.to(roomName).emit('battleResults', {
      winnerId,
      userScore,
      opponentScore: data.opponentScore,
      message: `${winnerId === userId ? 'You Won!' : 'You Lost!'}`,
    })

    // Clean up room after battle ends
    setTimeout(() => {
      const room = this.battleRooms.get(tournamentId)
      if (room) {
        room.users.clear()
        this.battleRooms.delete(tournamentId)
      }
    }, 5000)

    return { status: 'resultsSubmitted' }
  }

  @SubscribeMessage('leaveBattle')
  handleLeaveBattle(client: Socket, data: { tournamentId: number }) {
    const { tournamentId } = data
    const roomName = `tournament-${tournamentId}`
    const room = this.battleRooms.get(tournamentId)

    if (room) {
      room.users.delete(client.id)
    }

    client.leave(roomName)
    return { status: 'left' }
  }
}
