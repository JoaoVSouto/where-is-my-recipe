import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates user' })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created user',
    type: User,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        wantEmails: { type: 'boolean' },
      },
    },
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Updates user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user',
    type: User,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        password: { type: 'string', nullable: true },
        wantEmails: { type: 'boolean', nullable: true },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, id, updateUserDto);
  }

  @ApiOperation({ summary: 'Deletes user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted user',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.usersService.remove(req.user.id, id);
  }
}
