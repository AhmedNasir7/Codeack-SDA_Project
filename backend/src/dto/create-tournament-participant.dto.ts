export class CreateTournamentParticipantDto {
  tournament_id: number;
  user_id: number;
  final_rank?: number;
  final_score?: number;
}

