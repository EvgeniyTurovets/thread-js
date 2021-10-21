import React from 'react';
import PropTypes from 'prop-types';
import { Image, List, Modal } from 'semantic-ui-react';
import { getUserImgLink } from 'src/helpers/imageHelper';
import Spinner from 'src/components/Spinner';

import styles from './styles.module.scss';

const UserList = ({
  reactions,
  toggleReactedUsers: toggle
}) => (
  <Modal size="mini" open onClose={() => toggle()}>
    {reactions
      ? (
        <>
          <Modal.Header>Users who liked the post</Modal.Header>
          <Modal.Content scrolling>
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
          </Modal.Content>
        </>
      )
      : <Spinner />}
  </Modal>
);

UserList.propTypes = {
  reactions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  toggleReactedUsers: PropTypes.func.isRequired
};

export default UserList;
