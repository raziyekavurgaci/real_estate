import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(@InjectModel(Listing.name) private listingModel: Model<Listing>) {}

  async create(createListingDto: CreateListingDto): Promise<Listing> {
    const newListing = new this.listingModel(createListingDto);
    return newListing.save();
  }

  async findAll(): Promise<Listing[]> {
    return this.listingModel.find().populate('listingAgent').exec();
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingModel.findById(id).populate('listingAgent').exec();
    if (!listing) {
      throw new NotFoundException('Kayıt bulunamadı.');
    }
    return listing;
  }

  async update(id: string, updateData: UpdateListingDto): Promise<Listing> {
    const updated = await this.listingModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .populate('listingAgent')
      .exec();
    if (!updated) {
      throw new NotFoundException('Güncellenecek kayıt bulunamadı.');
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const result = await this.listingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Silinecek kayıt bulunamadı.');
    }
    return result;
  }
}
