import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel } from '../models/index';
import BaseRepository from './baseRepository';

class PostRepository extends BaseRepository {
  async getPosts(filter) {
    const {
      from: offset,
      count: limit,
      userId,
      likedUserId,
      isLike
    } = filter;

    const onlyMyPosts = userId ? { where: { userId } } : {};
    const likedByMe = (likedUserId && isLike) ? { where: { userId: likedUserId, isLike } } : {};

    const query = {
      ...onlyMyPosts,
      group: [
        'post.id',
        'image.id',
        'user.id',
        'user->image.id'
      ],
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "postReactions" as "reacts"
                        WHERE "post"."id" = "reacts"."postId"
                        AND "reacts"."isLike" = true)`), 'likeCount'],
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "postReactions" as "reacts"
                        WHERE "post"."id" = "reacts"."postId"
                        AND "reacts"."isDislike" = true)`), 'dislikeCount']
        ]
      },
      include: [{
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        ...likedByMe,
        model: PostReactionModel,
        attributes: [],
        duplicating: false
      }, {
        model: PostReactionModel,
        as: 'reactions',
        where: { isLike: true },
        duplicating: false,
        separate: true,
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: {
          model: UserModel,
          attributes: ['id', 'username'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }
      }],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    };

    return this.model.findAll(query);
  }

  getPostById(id) {
    return this.model.findOne({
      group: [
        'post.id',
        'comments.id',
        'comments->user.id',
        'comments->user->image.id',
        'user.id',
        'user->image.id',
        'image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "postReactions" as "reacts"
                        WHERE "post"."id" = "reacts"."postId"
                        AND "reacts"."isLike" = true)`), 'likeCount'],
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "postReactions" as "reacts"
                        WHERE "post"."id" = "reacts"."postId"
                        AND "reacts"."isDislike" = true)`), 'dislikeCount']
        ]
      },
      include: [{
        model: CommentModel,
        include: {
          model: UserModel,
          attributes: ['id', 'username', 'status'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }
      }, {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: PostReactionModel,
        as: 'reactions',
        where: { isLike: true },
        duplicating: false,
        separate: true,
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: {
          model: UserModel,
          attributes: ['id', 'username'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }
      }]
    });
  }
}

export default new PostRepository(PostModel);
