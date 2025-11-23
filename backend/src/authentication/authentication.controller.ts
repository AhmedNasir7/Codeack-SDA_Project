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
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from '../dto/create-authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthenticationDto) {
    return this.authenticationService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authenticationService.findAll();
  }

  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.authenticationService.findByUsername(username);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.authenticationService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.findOne(id);
  }

  @Patch(':id/last-login')
  updateLastLogin(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.updateLastLogin(id);
  }

  @Patch(':id/active')
  updateActiveStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('is_active') isActive: boolean,
  ) {
    return this.authenticationService.updateActiveStatus(id, isActive);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authenticationService.remove(id);
  }
}

