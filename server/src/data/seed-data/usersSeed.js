import { encryptSync } from '../../helpers/cryptoHelper';

const hash = password => encryptSync(password);
const now = new Date();

export const usersSeed = [{
  email: 'demo@demo.com',
  username: 'demo',
  password: hash('demo')
}, {
  email: 'gbottoms1@arizona.edu',
  username: 'jhon',
  password: hash('pxlxvUyyUjE')
}, {
  email: 'cclears2@state.gov',
  username: 'alex',
  password: hash('ioyLdS9Mdgj')
}, {
  email: 'htie3@chronoengine.com',
  username: 'kivi',
  password: hash('twn50kl')
}, {
  email: 'bbirmingham4@guardian.co.uk',
  username: 'avocado',
  password: hash('0naQBpP9')
}].map(user => ({
  ...user,
  createdAt: now,
  updatedAt: now
}));

// Do not add more images than the number of users.
export const userImagesSeed = [{
  link: 'https://i.imgur.com/kmdOBB7.jpg',
  deleteHash: 'APx0ofUQBidKc1P'
}, {
  link: 'https://i.imgur.com/gjKe442.jpg',
  deleteHash: 'qWVnICWmbmqwGre'
}, {
  link: 'https://i.imgur.com/0g89imt.jpg',
  deleteHash: '3cpoGBuOsXIe0o3'
}, {
  link: 'https://i.imgur.com/mYMcZdk.jpg',
  deleteHash: 'D6su1go8XvKpP4B'
}].map(image => ({
  ...image,
  createdAt: now,
  updatedAt: now
}));
