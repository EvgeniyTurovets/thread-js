import { PostReactionModel, PostModel, UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

class PostReactionRepository extends BaseRepository {
  getPostReaction(userId, postId) {
    return this.model.findOne({
      group: [
        'postReaction.id',
        'post.id'
      ],
      where: { userId, postId },
      include: [{
        model: PostModel,
        attributes: ['id', 'userId']
      }]
    });
  }

  getAllReactions(filter) {
    const {
      isLike,
      isDislike,
      postId
    } = filter;

    return this.model.findAll({
      group: [
        'postReaction.id',
        'user.id',
        'user->image.id'
      ],
      where: {
        postId,
        isLike: isLike || false,
        isDislike: isDislike || false
      },
      include: {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      },
      order: [['createdAt', 'DESC']]
    });
  }
}

export default new PostReactionRepository(PostReactionModel);
