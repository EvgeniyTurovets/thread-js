import callWebApi from 'src/helpers/webApiHelper';

export const getAllPosts = async filter => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const addPost = async request => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'POST',
    request
  });
  return response.json();
};

export const updatePost = async request => {
  const response = await callWebApi({
    endpoint: '/api/posts/update',
    type: 'PUT',
    request
  });
  return response.json();
};

export const deletePost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/delete/${id}`,
    type: 'POST'
  });
  return response.json();
};

export const getPost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const getAllReactions = async filter => {
  const response = await callWebApi({
    endpoint: '/api/posts/react/all',
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const getPostReaction = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/react/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const reactPost = async (postId, reactType) => {
  const response = await callWebApi({
    endpoint: '/api/posts/react',
    type: 'PUT',
    request: {
      postId,
      isLike: reactType === 'isLike',
      isDislike: reactType === 'isDislike'
    }
  });
  return response.json();
};

// should be replaced by approppriate function
export const getPostByHash = async hash => getPost(hash);
