export class CreateUserSubmissionDto {
  user_id: number;
  challenge_id: number;
  submission_id: number;
  code_content?: string;
  language?: string;
  score?: number;
  execution_time?: number;
  memory_used?: number;
}

