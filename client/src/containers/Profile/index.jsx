import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as imageService from 'src/services/imageService';
import { getUserImgLink } from 'src/helpers/imageHelper';
import validator from 'validator';
import {
  Grid,
  Image,
  Dropdown
} from 'semantic-ui-react';
import UpdateProfile from 'src/components/UpdateProfile';
import AvatarChange from 'src/components/AvatarChange';
import ConfirmAction from 'src/components/ConfirmAction';
import {
  updateUserInformation,
  updateUserAvatar,
  setUserFormStatus,
  toggleAvatarChange,
  toggleAvatarDelete
} from './actions';

import styles from './styles.module.scss';

const Profile = ({
  user,
  update,
  updateUserInformation: updateUser,
  updateUserAvatar: updateAvatar,
  setUserFormStatus: status,
  toggleAvatarChange: toggleAvatar,
  toggleAvatarDelete: toggleDelete,
  avatarChange,
  deleteStatus
}) => {
  const [userForm, setUserForm] = useState({
    id: user.id,
    username: user.username,
    status: user.status,
    email: user.email
  });
  const [userFormValid, setUserFormValid] = useState({
    username: false,
    status: false,
    email: false
  });
  const [userFormStatus, setUserFormError] = useState({});

  useEffect(() => {
    setUserForm({
      id: user.id,
      username: user.username,
      status: user.status,
      email: user.email
    });
  }, [user]);

  useEffect(() => {
    setUserFormError(update);
  }, [update]);

  useEffect(() => {
    status({ errorMessage: undefined, isLoading: undefined, success: undefined });
  }, [status]);

  const uploadImage = file => imageService.uploadImage(file);

  const userFormSubmit = async () => {
    await updateUser(userForm);
  };

  const handleUserNameChange = (e, { value }) => {
    setUserForm({ ...userForm, username: value });

    if (validator.isEmpty(value)) {
      setUserFormValid({ ...userFormValid, username: 'username cannot be empty' });
    } else if (!validator.isByteLength(value, { min: 4, max: 20 })) {
      setUserFormValid({ ...userFormValid, username: 'username must be at least 4 characters and no more than 20' });
    } else if (!validator.isAlpha(value)) {
      setUserFormValid({ ...userFormValid, username: 'username must be a-zA-Z' });
    } else {
      setUserFormValid({ ...userFormValid, username: false });
    }
  };

  const handleUserStatusChange = (e, { value }) => {
    if (value.length <= 40) {
      setUserForm({ ...userForm, status: value });
    }

    if (!validator.isByteLength(value, { max: 40 })) {
      setUserFormValid({ ...userFormValid, status: 'status must be no more than 40' });
    } else {
      setUserFormValid({ ...userFormValid, status: false });
    }
  };

  // const handleUserEmailChange = (e, { value }) => {
  //   setUserForm({ ...userForm, email: value });
  //   if (validator.isEmpty(value)) {
  //     setUserFormValid({ ...userFormValid, email: 'email cannot be empty' });
  //   } else if (!validator.isEmail(value)) {
  //     setUserFormValid({ ...userFormValid, email: 'wrong format' });
  //   } else {
  //     setUserFormValid({ ...userFormValid, email: false });
  //   }
  // };

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => toggleAvatar(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };

  return (
    <>
      <Grid container textAlign="center" className={styles.gridContainer}>
        <Grid.Column width={4}>
          <div className={styles.container}>
            <Image
              centered
              src={getUserImgLink(user.image)}
              size="medium"
              circular
              className={styles.avatar}
            />
            <Dropdown
              button
              className={`${styles.button} icon`}
              floating
              labeled
              icon="pencil alternate"
              text="Edit"
              pointing="top"
            >
              <Dropdown.Menu>
                <Dropdown.Item as="label">
                  Upload a photo...
                  <input
                    name="image"
                    type="file"
                    onChange={onSelectFile}
                    hidden
                  />
                </Dropdown.Item>
                {user.imageId && (
                  <Dropdown.Item text="Remove photo" onClick={() => toggleDelete(true)} />
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>
          <UpdateProfile
            user={user}
            userFormSubmit={userFormSubmit}
            userForm={userForm}
            userFormValid={userFormValid}
            userFormStatus={userFormStatus}
            handleUserNameChange={handleUserNameChange}
            handleUserStatusChange={handleUserStatusChange}
          />
        </Grid.Column>
      </Grid>
      {avatarChange && (
        <AvatarChange
          imageLink={avatarChange}
          uploadImage={uploadImage}
          toggle={toggleAvatar}
          updateAvatar={updateAvatar}
        />
      )}
      {deleteStatus && <ConfirmAction toggle={toggleDelete} confirm={updateAvatar} data={{ imageId: null }} />}
    </>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  update: PropTypes.objectOf(PropTypes.any),
  updateUserInformation: PropTypes.func.isRequired,
  updateUserAvatar: PropTypes.func.isRequired,
  setUserFormStatus: PropTypes.func.isRequired,
  toggleAvatarChange: PropTypes.func.isRequired,
  toggleAvatarDelete: PropTypes.func.isRequired,
  avatarChange: PropTypes.string,
  deleteStatus: PropTypes.bool
};

Profile.defaultProps = {
  avatarChange: undefined,
  deleteStatus: undefined,
  user: {},
  update: {}
};

const mapStateToProps = rootState => ({
  user: rootState.profile.user,
  update: rootState.profile.update,
  avatarChange: rootState.profile.avatarChange,
  deleteStatus: rootState.profile.deleteStatus
});

const actions = {
  updateUserInformation,
  updateUserAvatar,
  setUserFormStatus,
  toggleAvatarChange,
  toggleAvatarDelete
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
