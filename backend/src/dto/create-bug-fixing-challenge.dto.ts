export class CreateBugFixingChallengeDto {
  challenge_id: number;
  penalty_rules?: string;
  buggy_code: string;
  number_of_bugs?: number;
  expected_output?: string;
}

