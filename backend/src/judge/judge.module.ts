import { Module } from '@nestjs/common'
import { JudgeService } from './judge.service'
import { JudgeController } from './judge.controller'
import { CompilerModule } from '../compiler/compiler.module'
import { TestCaseModule } from '../test-case/test-case.module'

@Module({
  imports: [CompilerModule, TestCaseModule],
  providers: [JudgeService],
  controllers: [JudgeController],
  exports: [JudgeService],
})
export class JudgeModule {}
