import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AccessTokenGuard } from '../auth/guards/accesstoken.guard';
import { User } from '../users/schemas/user.schema';

interface JwtRequest extends Request {
  user: User & { sub: string; role: string };
}

@Controller('transactions')
@UseGuards(AccessTokenGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get('stats')
  getStats(@Req() req: JwtRequest) {
    return this.transactionsService.getStats(req.user.sub, req.user.role);
  }

  @Get()
  findAll(@Req() req: JwtRequest) {
    return this.transactionsService.findAll(req.user.sub, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/stage')
  updateStage(@Param('id') id: string, @Body() updateStageDto: UpdateStageDto) {
    return this.transactionsService.updateStage(id, updateStageDto);
  }
}
