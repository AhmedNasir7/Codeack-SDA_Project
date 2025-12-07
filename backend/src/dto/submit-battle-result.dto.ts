import { IsNumber, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class SubmitBattleResultDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  tournament_id: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  opponent_id: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  user_score: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  opponent_score: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  winner_id: number
}
