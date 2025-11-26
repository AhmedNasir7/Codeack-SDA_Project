import { Body, Controller, Post } from '@nestjs/common';
import { RunCodeDto } from '../dto/run-code.dto';
import { CompilerService } from './compiler.service';

@Controller('compiler')
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post('run')
  runCode(@Body() runCodeDto: RunCodeDto) {
    return this.compilerService.runCode(runCodeDto);
  }
}


