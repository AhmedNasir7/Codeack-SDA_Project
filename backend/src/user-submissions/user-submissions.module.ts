import { Module } from '@nestjs/common'
import { UserSubmissionsService } from './user-submissions.service'
import { UserSubmissionsController } from './user-submissions.controller'
import { SubmissionModule } from '../submission/submission.module'

@Module({
  imports: [SubmissionModule],
  controllers: [UserSubmissionsController],
  providers: [UserSubmissionsService],
  exports: [UserSubmissionsService],
})
export class UserSubmissionsModule {}
