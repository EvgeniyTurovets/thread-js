import * as postService from 'src/services/postService';
import * as commentService from 'src/services/commentService';
import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_EXPANDED_POST,
  SET_UPDATED_POST,
  SET_ALL_REACTIONS,
  SET_DELETED_POST
} from './actionTypes';

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});

const setUpdatedPostAction = post => ({
  type: SET_UPDATED_POST,
  post
});

const setPostReactionsAction = reactions => ({
  type: SET_ALL_REACTIONS,
  reactions
});

const setDeletedPost = post => ({
  type: SET_DELETED_POST,
  post
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const addPost = post => async dispatch => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const toggleDeletedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setDeletedPost(post));
};

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

export const toggleUpdatedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setUpdatedPostAction(post));
};

export const toggleReactedUsers = filter => async dispatch => {
  const reactions = filter ? await postService.getAllReactions(filter) : undefined;
  dispatch(setPostReactionsAction(reactions));
};

export const reactPost = (postId, reactType) => async (dispatch, getRootState) => {
  await postService.reactPost(postId, reactType);
  const reactedPost = await postService.getPost(postId);

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : reactedPost));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(reactedPost));
  }
};

export const updatePost = updatedPost => async (dispatch, getRootState) => {
  const { id } = await postService.updatePost(updatedPost);
  const newPost = await postService.getPost(id);

  const { posts: { posts, expandedPost } } = getRootState();

  const updated = posts.map(post => (post.id !== id ? post : newPost));
  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === id) {
    dispatch(setExpandedPostAction(newPost));
  }
};

export const deletePost = postId => async (dispatch, getRootState) => {
  const { id } = await postService.deletePost(postId);

  const { posts: { posts, expandedPost } } = getRootState();

  const updated = posts.filter(post => post.id !== id);
  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === id) {
    dispatch(toggleExpandedPost());
  }
};

export const addComment = request => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment] // comment is taken from the current closure
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== comment.postId
    ? post
    : mapComments(post)));

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }
};

