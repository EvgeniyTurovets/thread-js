import { createToken } from '../../helpers/tokenHelper';
import { encrypt } from '../../helpers/cryptoHelper';
import userRepository from '../../data/repositories/userRepository';

export const login = async ({ id }) => {
  const { id: userId, username, email, imageId, image, status } = await userRepository.getUserById(id);

  return {
    token: createToken({ id }),
    user: { id: userId, username, email, imageId, image, status }
  };
};

export const register = async ({ password, ...userData }) => {
  const newUser = await userRepository.addUser({
    ...userData,
    password: await encrypt(password)
  });
  return login(newUser);
};
