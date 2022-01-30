import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Like, LikeSchema } from './schemas/like.schema';
import { LikesService } from './likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
