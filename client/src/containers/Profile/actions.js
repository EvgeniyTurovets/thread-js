import * as authService from 'src/services/authService';
import {
  SET_USER,
  SET_USER_FORM_UPDATE,
  SET_AVATAR_CHANGE,
  SET_AVATAR_DELETE
} from './actionTypes';

const setToken = token => localStorage.setItem('token', token);

const setUser = user => async dispatch => dispatch({
  type: SET_USER,
  user
});

const setAvatarChange = imageLink => async dispatch => dispatch({
  type: SET_AVATAR_CHANGE,
  imageLink
});

const setAvatarDelete = deleteStatus => async dispatch => dispatch({
  type: SET_AVATAR_DELETE,
  deleteStatus
});

export const setUserFormStatus = update => async dispatch => dispatch({
  type: SET_USER_FORM_UPDATE,
  update
});

export const toggleAvatarChange = imageLink => async dispatch => {
  const link = imageLink || undefined;
  dispatch(setAvatarChange(link));
};

export const toggleAvatarDelete = deleteStatus => async dispatch => {
  const bool = deleteStatus || undefined;
  dispatch(setAvatarDelete(bool));
};

const setAuthData = (user = null, token = '') => (dispatch, getRootState) => {
  setToken(token); // token should be set first before user
  setUser(user)(dispatch, getRootState);
};

const handleAuthResponse = authResponsePromise => async (dispatch, getRootState) => {
  const { user, token } = await authResponsePromise;
  setAuthData(user, token)(dispatch, getRootState);
};

export const login = request => handleAuthResponse(authService.login(request));

export const register = request => handleAuthResponse(authService.registration(request));

export const logout = () => setAuthData();

export const loadCurrentUser = () => async (dispatch, getRootState) => {
  const user = await authService.getCurrentUser();
  setUser(user)(dispatch, getRootState);
};

export const updateUserInformation = data => async dispatch => {
  setUserFormStatus({ errorMessage: undefined, isLoading: true, success: undefined })(dispatch);
  const user = await authService.updateUser(data);

  if (user.message) {
    setUserFormStatus({ errorMessage: user.message, isLoading: false })(dispatch);
  } else {
    setUser(user)(dispatch);
    setUserFormStatus({ isLoading: false, success: 'Your profile has been successfully updated' })(dispatch);
  }
};

export const updateUserAvatar = data => async dispatch => {
  const user = await authService.updateUser(data);
  setUser(user)(dispatch);
};

export const updateUserStatus = data => async dispatch => {
  const user = await authService.updateUser(data);
  setUser(user)(dispatch);
};
