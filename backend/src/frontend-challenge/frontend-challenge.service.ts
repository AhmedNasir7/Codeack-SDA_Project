import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { CreateFrontendChallengeDto } from '../dto/create-frontend-challenge.dto'

@Injectable()
export class FrontendChallengeService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateFrontendChallengeDto) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('front_end_challenge')
      .insert({
        ...createDto,
        required_technologies: createDto.required_technologies || [],
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async findAll() {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('front_end_challenge')
      .select('*')

    if (error) throw error
    return data
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('front_end_challenge')
      .select('*')
      .eq('frontend_id', id)
      .single()

    if (error) throw error
    return data
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('front_end_challenge')
      .select('*')
      .eq('challenge_id', challengeId)

    if (error) {
      throw error
    }

    // Return first result if found, otherwise throw error
    if (!data || data.length === 0) {
      throw new Error(
        `No frontend challenge found for challenge_id: ${challengeId}`,
      )
    }

    return data[0]
  }

  async update(id: number, updateData: Partial<CreateFrontendChallengeDto>) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('front_end_challenge')
      .update(updateData)
      .eq('frontend_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient()
    const { error } = await supabase
      .from('front_end_challenge')
      .delete()
      .eq('frontend_id', id)

    if (error) throw error
    return { message: 'Frontend challenge deleted successfully' }
  }
}
