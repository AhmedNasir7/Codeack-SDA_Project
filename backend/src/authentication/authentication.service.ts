import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { CreateAuthenticationDto } from '../dto/create-authentication.dto'
import { RegisterDto } from '../dto/register.dto'
import { LoginDto } from '../dto/login.dto'

@Injectable()
export class AuthenticationService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createAuthDto: CreateAuthenticationDto) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .insert(createAuthDto)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async findAll() {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase.from('authentication').select('*')

    if (error) throw error
    return data
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('auth_id', id)
      .single()

    if (error) throw error
    return data
  }

  async findByUsername(username: string) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return data
  }

  async findByEmail(email: string) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  }

  async updateLastLogin(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .update({ last_login: new Date().toISOString() })
      .eq('auth_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateActiveStatus(id: number, isActive: boolean) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('authentication')
      .update({ is_active: isActive })
      .eq('auth_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient()
    const { error } = await supabase
      .from('authentication')
      .delete()
      .eq('auth_id', id)

    if (error) throw error
    return { message: 'Authentication record deleted successfully' }
  }

  /**
   * Register a new user with Supabase Auth
   * Sends verification email automatically
   * Creates authentication record in database
   */
  async register(registerDto: RegisterDto) {
    const supabase = this.supabaseService.getClient()

    const { data, error } = await supabase.auth.signUp({
      email: registerDto.email,
      password: registerDto.password,
      options: {
        emailRedirectTo: 'http://localhost:3001/login',
        data: {
          username: registerDto.username,
        },
      },
    })

    if (error) {
      throw new BadRequestException(error.message)
    }

    if (!data.user) {
      throw new BadRequestException('Failed to create user')
    }

    const emailConfirmed = data.user.email_confirmed_at !== null

    // Create authentication record in database
    try {
      const { data: authRecord, error: authError } = await supabase
        .from('authentication')
        .insert({
          username: registerDto.username,
          email: registerDto.email,
          hashed_password: 'managed_by_supabase_auth', // Password managed by Supabase Auth
          is_active: emailConfirmed, // Active only if email confirmed
        })
        .select()
        .single()

      if (authError && !authError.message.includes('duplicate')) {
        console.warn(
          'Could not create authentication record:',
          authError.message,
        )
      }
    } catch (error) {
      console.warn('Error creating authentication record:', error.message)
    }

    // If email is already confirmed, create user record
    if (emailConfirmed) {
      await this.createUserRecord(supabase, data.user.id, registerDto)
    }

    return {
      message:
        'Registration successful! Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: registerDto.username,
        emailConfirmed: emailConfirmed,
      },
    }
  }

  /**
   * Helper method to create user record in users table
   */
  private async createUserRecord(
    supabase: any,
    authUserId: string,
    userData: { username: string; email: string },
  ) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        console.log('User record already exists')
        return
      }

      // Get authentication record to get auth_id
      const { data: authRecord } = await supabase
        .from('authentication')
        .select('auth_id')
        .eq('email', userData.email)
        .single()

      if (!authRecord) {
        console.warn('Authentication record not found for user creation')
        return
      }

      // Create portfolio first
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolio')
        .insert({
          bio: null,
          solved_questions: 0,
          total_score: 0,
          rank_level: null,
        })
        .select()
        .single()

      if (portfolioError) {
        console.warn('Could not create portfolio:', portfolioError.message)
        return
      }

      // Create user record
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert({
          name: userData.username,
          username: userData.username,
          email: userData.email,
          password_hash: 'managed_by_supabase_auth',
          auth_id: authRecord.auth_id,
          portfolio_id: portfolio.portfolio_id,
        })
        .select()
        .single()

      if (userError) {
        console.warn('Could not create user record:', userError.message)
      } else {
        console.log(`✓ User record created in database: ${userRecord.user_id}`)
      }
    } catch (error) {
      console.warn('Error creating user record:', error.message)
    }
  }

  /**
   * Login user with email and password
   * Creates user record in database if email is confirmed and user doesn't exist
   */
  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    })

    if (error) {
      throw new UnauthorizedException(error.message)
    }

    if (!data.user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const emailConfirmed = data.user.email_confirmed_at !== null
    const username =
      data.user.user_metadata?.username || loginDto.email.split('@')[0]

    // If email is confirmed, ensure user record exists in database
    if (emailConfirmed) {
      // Check if user record exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', loginDto.email)
        .single()

      if (!existingUser) {
        // User record doesn't exist, create it
        console.log('Creating user record for confirmed email...')

        // Get authentication record
        const { data: authRecord } = await supabase
          .from('authentication')
          .select('auth_id')
          .eq('email', loginDto.email)
          .single()

        if (authRecord) {
          // Update authentication to active
          await supabase
            .from('authentication')
            .update({ is_active: true, last_login: new Date().toISOString() })
            .eq('auth_id', authRecord.auth_id)

          // Create user record
          await this.createUserRecord(supabase, data.user.id, {
            username: username,
            email: loginDto.email,
          })
        }
      } else {
        // Update last login in authentication table
        const { data: authRecord } = await supabase
          .from('authentication')
          .select('auth_id')
          .eq('email', loginDto.email)
          .single()

        if (authRecord) {
          await supabase
            .from('authentication')
            .update({ last_login: new Date().toISOString(), is_active: true })
            .eq('auth_id', authRecord.auth_id)
        }
      }
    }

    return {
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: emailConfirmed,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    }
  }
}
