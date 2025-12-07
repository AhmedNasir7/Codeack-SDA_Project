export class CreateBattleSessionDto {
  tournament_id: number
  user_id: number
  opponent_id?: number
  status?: string // 'waiting', 'active', 'completed'
  user_score?: number
  opponent_score?: number
  winner_id?: number
  completed_at?: string
}
