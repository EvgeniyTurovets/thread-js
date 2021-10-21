import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Message
} from 'semantic-ui-react';

const UpdateProfile = ({
  user,
  userFormSubmit,
  userForm,
  userFormValid,
  userFormStatus,
  handleUserNameChange,
  handleUserStatusChange
}) => {
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(!((userForm.username !== user.username
      || userForm.status !== user.status
      || userForm.email !== user.email)
      && !userFormValid.username
      && !userFormValid.status
      && !userFormValid.email));
  }, [user, userForm, userFormValid]);

  return (
    <Form
      onSubmit={userFormSubmit}
      error={userFormStatus?.errorMessage && true}
      loading={userFormStatus?.isLoading}
      success={userFormStatus?.success && true}
    >
      <Form.Input
        fluid
        name="username"
        icon="user"
        iconPosition="left"
        placeholder="Username"
        type="text"
        value={userForm.username}
        error={userFormValid.username}
        onChange={handleUserNameChange}
      />
      <Form.Input
        fluid
        name="status"
        icon="smile"
        iconPosition="left"
        placeholder="Status"
        type="text"
        value={userForm.status || ''}
        error={userFormValid.status}
        onChange={handleUserStatusChange}
      />
      <Form.Input
        disabled
        fluid
        name="email"
        icon="at"
        iconPosition="left"
        placeholder="Email"
        type="email"
        value={userForm.email}
        error={userFormValid.email}
      // onChange={handleUserEmailChange}
      />
      <Form.Button
        disabled={formValid}
        content="Save"
        color="teal"
      />
      {userFormStatus?.errorMessage && (
        <Message
          error
          header="Action Forbidden"
          content={userFormStatus?.errorMessage}
        />
      )}
      {userFormStatus?.success && (
        <Message
          success
          header="Form Completed"
          content={userFormStatus?.success}
        />
      )}
    </Form>
  );
};

UpdateProfile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  userFormSubmit: PropTypes.func.isRequired,
  userForm: PropTypes.objectOf(PropTypes.any).isRequired,
  userFormValid: PropTypes.objectOf(PropTypes.any).isRequired,
  userFormStatus: PropTypes.objectOf(PropTypes.any).isRequired,
  handleUserNameChange: PropTypes.func.isRequired,
  handleUserStatusChange: PropTypes.func.isRequired
};

export default UpdateProfile;
