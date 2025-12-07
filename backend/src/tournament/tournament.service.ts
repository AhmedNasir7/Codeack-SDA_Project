import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { CreateTournamentDto } from '../dto/create-tournament.dto'

@Injectable()
export class TournamentService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament')
      .insert(createTournamentDto)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async findAll() {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase.from('tournament').select('*')

    if (error) throw error
    return data
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament')
      .select('*')
      .eq('tournament_id', id)
      .single()

    if (error) throw error
    return data
  }

  async findByStatus(status: string) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament')
      .select('*')
      .eq('status', status)

    if (error) throw error
    return data
  }

  async findActive() {
    const supabase = this.supabaseService.getClient()

    // Get tournaments with Active, commenced, or ongoing status
    // Don't strictly validate dates - just return active tournaments
    const { data, error } = await supabase
      .from('tournament')
      .select('*')
      .in('status', ['Active', 'commenced', 'ongoing', 'Commenced', 'Ongoing'])

    if (error) {
      console.error('Error in findActive:', error)
      throw error
    }

    return data || []
  }

  async update(id: number, updateData: Partial<CreateTournamentDto>) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament')
      .update(updateData)
      .eq('tournament_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient()
    const { error } = await supabase
      .from('tournament')
      .delete()
      .eq('tournament_id', id)

    if (error) throw error
    return { message: 'Tournament deleted successfully' }
  }
}
