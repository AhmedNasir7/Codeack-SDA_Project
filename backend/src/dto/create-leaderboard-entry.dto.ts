export class CreateLeaderboardEntryDto {
  leaderboard_id: number;
  user_id?: number;
  team_id?: number;
  rank_position: number;
  total_score?: number;
  challenges_solved?: number;
}

