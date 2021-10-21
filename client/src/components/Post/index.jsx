import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, Popup, Button, List } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const Post = ({
  userId,
  post,
  reactPost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleReactedUsers,
  toggleDeletedPost,
  sharePost
}) => {
  const [popup, setPopup] = useState(false);
  const {
    id,
    image,
    body,
    reactions,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const date = moment(createdAt).fromNow();

  return (
    <Card style={{ width: '100%' }}>
      {image && <Image src={image.link} wrapped ui={false} />}
      <Card.Content>
        <Card.Meta>
          <span className="date">
            posted by
            {' '}
            {user.username}
            {' - '}
            {date}
          </span>
        </Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Popup
          disabled={popup}
          onUnmount={() => setPopup(false)}
          mouseEnterDelay={500}
          mouseLeaveDelay={500}
          hoverable
          flowing
          hideOnScroll
          position="bottom left"
          trigger={(
            <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => reactPost(id, 'isLike')}>
              <Icon name="thumbs up" />
              {likeCount}
            </Label>
          )}
        >
          <Popup.Content>
            {likeCount < 1 ? (
              <div>No likes</div>
            ) : (
              <>
                <List>
                  {reactions && reactions.map(reaction => (
                    <List.Item key={reaction.id} className={styles.userListItem}>
                      <Image
                        avatar
                        src={getUserImgLink(reaction.user.image)}
                        className={styles.avatar}
                      />
                      <List.Header as="a">{reaction.user.username}</List.Header>
                    </List.Item>
                  ))}
                </List>
                <Button
                  compact
                  onClick={() => {
                    toggleReactedUsers({ isLike: true, postId: id });
                    setPopup(true);
                  }}
                >
                  See all
                </Button>
              </>
            )}
          </Popup.Content>
        </Popup>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => reactPost(id, 'isDislike')}>
          <Icon name="thumbs down" />
          {dislikeCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
          <Icon name="comment" />
          {commentCount}
        </Label>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
          <Icon name="share alternate" />
        </Label>
        {userId && userId === user.id && (
          <>
            <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleUpdatedPost(id)}>
              <Icon name="sync" />
            </Label>
            <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleDeletedPost(id)}>
              <Icon name="trash" />
            </Label>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

Post.propTypes = {
  userId: PropTypes.string.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  reactPost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleReactedUsers: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

export default Post;
