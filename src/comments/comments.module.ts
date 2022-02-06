import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
    imports:[
        MongooseModule.forFeature([{name: Comment.name, schema:CommentSchema}]),
    ],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule{}