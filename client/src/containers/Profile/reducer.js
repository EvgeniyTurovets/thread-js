import {
  SET_USER,
  SET_USER_FORM_UPDATE,
  SET_AVATAR_CHANGE,
  SET_AVATAR_DELETE
} from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        isAuthorized: Boolean(action.user?.id),
        isLoading: false
      };
    case SET_AVATAR_CHANGE:
      return {
        ...state,
        avatarChange: action.imageLink
      };
    case SET_AVATAR_DELETE:
      return {
        ...state,
        deleteStatus: action.deleteStatus
      };
    case SET_USER_FORM_UPDATE:
      return {
        ...state,
        update: {
          ...state.update || {},
          ...action.update
        }
      };
    default:
      return state;
  }
};
