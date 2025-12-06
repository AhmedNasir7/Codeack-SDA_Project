import { Module } from '@nestjs/common'
import { TestCaseService } from './test-case.service'
import { TestCaseController } from './test-case.controller'
import { SupabaseModule } from '../supabase/supabase.module'

@Module({
  imports: [SupabaseModule],
  controllers: [TestCaseController],
  providers: [TestCaseService],
  exports: [TestCaseService],
})
export class TestCaseModule {}
