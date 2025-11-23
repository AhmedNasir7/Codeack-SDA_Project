import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePortfolioDto: Partial<CreatePortfolioDto>,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Patch(':id/increment-solved')
  incrementSolved(
    @Param('id', ParseIntPipe) id: number,
    @Body('increment') increment: number = 1,
  ) {
    return this.portfolioService.incrementSolvedQuestions(id, increment);
  }

  @Patch(':id/add-score')
  addScore(
    @Param('id', ParseIntPipe) id: number,
    @Body('score') score: number,
  ) {
    return this.portfolioService.addScore(id, score);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.remove(id);
  }
}

