import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const { id, username, email, imageId, image, status } = await userRepository.getUserById(userId);
  return { id, username, email, imageId, image, status };
};

export const updateUser = async (currentUser, updatedUser) => {
  const { id } = await userRepository.updateById(currentUser.id, updatedUser);
  const user = await getUserById(id);
  return user;
};
