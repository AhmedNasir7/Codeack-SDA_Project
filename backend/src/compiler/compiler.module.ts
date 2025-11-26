import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CompilerController } from './compiler.controller';
import { CompilerService } from './compiler.service';

@Module({
  imports: [HttpModule],
  controllers: [CompilerController],
  providers: [CompilerService],
})
export class CompilerModule {}


