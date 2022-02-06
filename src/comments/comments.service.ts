import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Comment, CommentDocument } from './schemas/comment.schema';


@Injectable()
export class CommentsService{
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

	create(createCommentDto: CreateCommentDto){
		return new this.commentModel(createCommentDto).save();
	}

	async update(userId:string, commentId:string, comment:UpdateCommentDto){
		const commentToBeUpdated = await this.commentModel.findById(commentId);

		if(!commentToBeUpdated){
			throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
		}

		const commentOwner = commentToBeUpdated.author._id.toString();

		if(userId !== commentOwner){
			throw new HttpException(
				'You are not authorized to update this comment',
				HttpStatus.UNAUTHORIZED,
			);
		}

		return this.commentModel.findByIdAndUpdate(
			commentId,
			{
				$set: comment,
			},
			{ new: true },
		);
	}
	async remove(userId:string, commentId:string){
		const commentToBeRemoved = await this.commentModel.findById(commentId);

		if(!commentToBeRemoved){
			throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
		}

		const commentOwner = commentToBeRemoved.author._id.toString();

		if(userId !== commentOwner){
			throw new HttpException(
				'You are not authorized to remove this comment',
				HttpStatus.UNAUTHORIZED,
			);
		}

		await commentToBeRemoved.remove();
	}

	async findById(commentId: string){
		const comment = await this.commentModel.findById(commentId)
		.populate("author", "name -_id");
		if(!comment){
			throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
		}
		return Object.assign(comment.toObject());
	}

	findAllByRecipe(recipeId: string) {
		return this.commentModel.find({ recipe: recipeId });
	}

	removeAllByRecipe(recipeId:string){
		return this.commentModel.deleteMany({recipe:recipeId});
	}
}