import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Logs the user in' })
  @ApiResponse({
    status: 201,
    description: 'Returns JWT access token',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Returns information about the logged in user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns user data',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        wantEmails: { type: 'boolean' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }
}
