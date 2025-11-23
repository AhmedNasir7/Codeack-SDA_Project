export class CreateTournamentDto {
  tournament_name: string;
  start_date: string;
  end_date: string;
  prize_pool?: number;
  status?: string;
  leaderboard_id?: number;
}

