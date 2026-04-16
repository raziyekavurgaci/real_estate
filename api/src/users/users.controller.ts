import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/accesstoken.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface JwtRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getMe(@Req() req: JwtRequest) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  async updateMe(@Req() req: JwtRequest, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub;  
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersService.update(userId, updateUserDto);
  }
}
