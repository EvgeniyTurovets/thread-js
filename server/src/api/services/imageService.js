import axios from 'axios';
import { imgurId } from '../../config/imgurConfig';
import imageRepository from '../../data/repositories/imageRepository';

const uploadToImgur = async file => {
  try {
    const { data: { data } } = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: file.buffer.toString('base64')
      }, {
        headers: { Authorization: `Client-ID ${imgurId}` }
      }
    );
    return {
      link: data.link,
      deleteHash: data.deletehash
    };
  } catch ({ response: { data: { status, data } } }) { // parse Imgur error
    return Promise.reject({ status, message: data.error });
  }
};

export const upload = async file => {
  const image = await uploadToImgur(file);
  return imageRepository.create(image);
};
