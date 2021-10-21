import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import UpdatedPost from 'src/components/UpdatedPost';
import UserList from 'src/components/UserList';
import ConfirmAction from 'src/components/ConfirmAction';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import {
  loadPosts,
  loadMorePosts,
  reactPost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleReactedUsers,
  toggleDeletedPost,
  addPost,
  deletePost,
  updatePost
} from './actions';

import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  likedUserId: undefined,
  isLike: undefined,
  from: 0,
  count: 10
};

const Thread = ({
  userId,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  updatedPost,
  deletedPost,
  reactions,
  hasMorePosts,
  addPost: createPost,
  reactPost: react,
  deletePost: remove,
  updatePost: update,
  toggleExpandedPost: toggleExpended,
  toggleUpdatedPost: toggleUpdated,
  toggleReactedUsers: toggleReacted,
  toggleDeletedPost: toggleDeleted
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);
  const [showLikedPosts, setShowLikedPosts] = useState(false);

  const toggleShowOwnPosts = () => {
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const toggleShowLikedPosts = () => {
    setShowLikedPosts(!showLikedPosts);
    postsFilter.likedUserId = showLikedPosts ? undefined : userId;
    postsFilter.isLike = showLikedPosts ? undefined : true;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = id => {
    setSharedPostId(id);
  };

  const uploadImage = file => imageService.uploadImage(file);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} uploadImage={uploadImage} />
      </div>
      <div className={styles.toolbar}>
        <Checkbox
          toggle
          label="Show only my posts"
          checked={showOwnPosts}
          onChange={toggleShowOwnPosts}
        />
        <Checkbox
          toggle
          label="Liked by me"
          checked={showLikedPosts}
          onChange={toggleShowLikedPosts}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            userId={userId}
            post={post}
            reactPost={react}
            toggleDeletedPost={toggleDeleted}
            toggleExpandedPost={toggleExpended}
            toggleUpdatedPost={toggleUpdated}
            toggleReactedUsers={toggleReacted}
            sharePost={sharePost}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && <ExpandedPost sharePost={sharePost} />}
      {updatedPost
        && (
          <UpdatedPost
            uploadImage={uploadImage}
            updatedPost={updatedPost}
            updatePost={update}
            toggleUpdatedPost={toggleUpdated}
          />
        )}
      {reactions && <UserList reactions={reactions} toggleReactedUsers={toggleReacted} />}
      {sharedPostId && <SharedPostLink postId={sharedPostId} close={() => setSharedPostId(undefined)} />}
      {deletedPost && <ConfirmAction toggle={toggleDeleted} confirm={remove} data={deletedPost.id} />}
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  reactions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  updatedPost: PropTypes.objectOf(PropTypes.any),
  deletedPost: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  reactPost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleReactedUsers: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  updatedPost: undefined,
  deletedPost: undefined,
  reactions: undefined,
  userId: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  updatedPost: rootState.posts.updatedPost,
  deletedPost: rootState.posts.deletedPost,
  reactions: rootState.posts.reactions,
  userId: rootState.profile.user.id
});

const actions = {
  loadPosts,
  loadMorePosts,
  reactPost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleReactedUsers,
  toggleDeletedPost,
  addPost,
  deletePost,
  updatePost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
