import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AccessTokenGuard } from '../auth/guards/accesstoken.guard';

interface JwtRequest extends Request {
  user: { sub: string };
}

@Controller('listings')
@UseGuards(AccessTokenGuard)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Req() req: JwtRequest, @Body() createListingDto: CreateListingDto) {
    // İlanı oluşturan kişiyi otomatik olarak token'dan alıyoruz
    createListingDto.listingAgent = req.user.sub;
    return this.listingsService.create(createListingDto);
  }

  @Get()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
