export class CreateChallengeDto {
  title: string;
  description: string;
  difficulty: string;
  allowed_languages?: string[];
  time_limit?: number;
}

