// Test case DTOs - Test cases are stored in memory, not in database
export class CreateTestCaseDto {
  challenge_id: number
  input: string
  expected_output: string
  description?: string
  is_sample?: boolean
}

export class TestCaseResponseDto {
  test_case_id: number
  challenge_id: number
  input: string
  expected_output: string
  description: string
  is_sample: boolean
}
