import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { SubmissionService } from '../submission/submission.service'
import { CreateUserSubmissionDto } from '../dto/create-user-submission.dto'

@Injectable()
export class UserSubmissionsService {
  constructor(
    private supabaseService: SupabaseService,
    private submissionService: SubmissionService,
  ) {}

  async create(createDto: CreateUserSubmissionDto) {
    try {
      const supabase = this.supabaseService.getClient()

      // Step 1: Create submission record in 'submission' table
      let submissionId = 0
      try {
        const submissionData = await this.submissionService.create({
          status: 'submitted',
        })

        // Extract ID from submission data - try multiple field names
        if (submissionData?.submission_id) {
          submissionId = submissionData.submission_id
        } else if (submissionData?.id) {
          submissionId = submissionData.id
        } else {
          submissionId = 0
        }
      } catch (submissionError) {
        submissionId = 0
      }

      // Step 2: Create user submission record
      const userSubmissionData = {
        ...createDto,
        submission_id: submissionId,
      }

      const { data, error } = await supabase
        .from('user_submissions')
        .insert(userSubmissionData)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase.from('user_submissions').select('*')

    if (error) throw error
    return data
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('challenge_id', challengeId)

    if (error) throw error
    return data
  }

  async findByUserAndChallenge(userId: number, challengeId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)

    if (error) throw error
    return data
  }

  async update(id: number, updateData: Partial<CreateUserSubmissionDto>) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('user_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient()
    const { error } = await supabase
      .from('user_submissions')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { message: 'User submission deleted successfully' }
  }
}
