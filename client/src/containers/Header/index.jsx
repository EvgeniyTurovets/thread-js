import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button, Input } from 'semantic-ui-react';
import { updateUserStatus, logout } from 'src/containers/Profile/actions';

import styles from './styles.module.scss';

const Header = ({
  user,
  logout: signOut,
  updateUserStatus: updateUser
}) => {
  const [isEditing, setEditing] = useState(false);
  const [statusInput, setStatusInput] = useState(false);
  const [status, setStatus] = useState(user.status);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setStatus(user.status);
  }, [user]);

  const handleUserStatusChange = (e, { value }) => {
    if (value.length <= 30) {
      setStatus(value);
    }
  };

  const statusSubmit = async () => {
    await updateUser({
      id: user.id,
      username: user.username,
      status,
      email: user.email
    });
  };

  return (
    <div className={styles.headerWrp}>
      <Grid centered container columns="3">
        <Grid.Column>
          {user && (
            <HeaderUI className={styles.header}>
              <NavLink exact to="/" className={styles.avatar}>
                <Image circular src={getUserImgLink(user.image)} avatar />
              </NavLink>
              <HeaderUI.Content className={!statusInput ? styles.headerContent : ''}>
                {user.username}
                <br />
                {statusInput ? (
                  <Input
                    ref={inputRef}
                    className={styles.statusInput}
                    action={{
                      color: 'teal',
                      icon: 'pencil alternate',
                      className: styles.submit,
                      onClick: () => {
                        statusSubmit();
                        setStatusInput(false);
                        setEditing(false);
                      }
                    }}
                    transparent
                    size="mini"
                    name="status"
                    placeholder="Status"
                    type="text"
                    value={status || ''}
                    onChange={handleUserStatusChange}
                    onBlur={() => {
                      statusSubmit();
                      setStatusInput(false);
                      setEditing(false);
                    }}
                  />
                ) : user.status
                  && (
                    <HeaderUI.Subheader>
                      {user.status}
                      {' '}
                      <Button
                        icon="pencil alternate"
                        className={styles.pen}
                        onClick={() => {
                          setStatusInput(true);
                          setEditing(true);
                        }}
                      />
                    </HeaderUI.Subheader>
                  )}
              </HeaderUI.Content>
            </HeaderUI>
          )}
        </Grid.Column>
        <Grid.Column />
        <Grid.Column textAlign="right">
          <NavLink exact activeClassName="active" to="/profile" className={styles.menuBtn}>
            <Icon name="user circle" size="large" />
          </NavLink>
          <Button basic icon type="button" className={`${styles.menuBtn} ${styles.logoutBtn}`} onClick={signOut}>
            <Icon name="log out" size="large" />
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  updateUserStatus: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

const actions = {
  logout,
  updateUserStatus
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
