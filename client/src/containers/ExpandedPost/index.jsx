import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import {
  reactPost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleReactedUsers,
  toggleDeletedPost,
  addComment
} from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';

const ExpandedPost = ({
  userId,
  post,
  sharePost,
  reactPost: react,
  toggleExpandedPost: toggleExpended,
  toggleUpdatedPost: toggleUpdated,
  toggleReactedUsers: toggleReacted,
  toggleDeletedPost: toggleDeleted,
  addComment: add
}) => (
  <Modal centered={false} open onClose={() => toggleExpended()}>
    {post
      ? (
        <Modal.Content>
          <Post
            userId={userId}
            post={post}
            reactPost={react}
            toggleDeletedPost={toggleDeleted}
            toggleExpandedPost={toggleExpended}
            toggleUpdatedPost={toggleUpdated}
            toggleReactedUsers={toggleReacted}
            sharePost={sharePost}
          />
          <CommentUI.Group style={{ maxWidth: '100%' }}>
            <Header as="h3" dividing>
              Comments
            </Header>
            {post.comments && post.comments
              .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
              .map(comment => <Comment key={comment.id} comment={comment} />)}
            <AddComment postId={post.id} addComment={add} />
          </CommentUI.Group>
        </Modal.Content>
      )
      : <Spinner />}
  </Modal>
);

ExpandedPost.propTypes = {
  userId: PropTypes.string.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleReactedUsers: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  reactPost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost,
  userId: rootState.profile.user.id
});

const actions = {
  reactPost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleReactedUsers,
  toggleDeletedPost,
  addComment
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
