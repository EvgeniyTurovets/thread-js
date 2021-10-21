import postRepository from '../../data/repositories/postRepository';
import postReactionRepository from '../../data/repositories/postReactionRepository';

export const getPosts = filter => postRepository.getPosts(filter);

export const getPostById = id => postRepository.getPostById(id);

export const create = (userId, post) => postRepository.create({
  ...post,
  userId
});

export const updatePost = post => postRepository.updateById(post.postId, {
  imageId: post.imageId,
  body: post.body
});

export const deletePost = postId => postRepository.deleteById(postId);

export const getAllReactions = filter => postReactionRepository.getAllReactions(filter);

export const getPostReaction = async (userId, postId) => {
  const reaction = await postReactionRepository.getPostReaction(userId, postId);

  return reaction || {};
};

export const setReaction = async (userId, { postId, isLike = false, isDislike = false }) => {
  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  let update;

  if (isLike) {
    update = react => (react.isLike === isLike
      ? postReactionRepository.updateById(react.id, { isLike: !isLike })
      : postReactionRepository.updateById(react.id, { isLike, isDislike }));
  } else {
    update = react => (react.isDislike === isDislike
      ? postReactionRepository.updateById(react.id, { isDislike: !isDislike })
      : postReactionRepository.updateById(react.id, { isDislike, isLike }));
  }

  const result = reaction
    ? await update(reaction)
    : await postReactionRepository.create({ userId, postId, isLike, isDislike });

  return result;
};
