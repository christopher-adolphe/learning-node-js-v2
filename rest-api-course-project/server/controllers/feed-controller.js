let posts = [
  {
    _id: '1',
    title: 'The First Post',
    content: 'This is the first post content.',
    imageUrl: 'images/react-logo.png',
    creator: {
      name: 'Jane Doe',
    },
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'The Second Post',
    content: 'This is the second post content.',
    imageUrl: 'images/react-logo.png',
    creator: {
      name: 'Greg Lutzska',
    },
    createdAt: new Date(),
  },
  {
    _id: '3',
    title: 'The Third Post',
    content: 'This is the third post content.',
    imageUrl: 'images/react-logo.png',
    creator: {
      name: 'Rachel Robins',
    },
    createdAt: new Date(),
  },
];

const getPosts = (request, response, next) => {
  response.status(200).json(
    {
      posts,
    }
  )
};

const getPost = (request, response, next) => {
  const { id } = request.params;

  const post = posts.find(post => post._id === id);

  response.status(200).json({ post });
};

const createPost = (request, response, next) => {
  const { title, content } = request.body;

  const post = {
    _id: `${posts.length + 1}`,
    title,
    content,
    imageUrl: 'images/react-logo.png',
    creator: {
      name: 'Rachel Robins',
    },
    createdAt: new Date(),
  };

  posts.push(post);

  response.status(201).json({
    message: 'New post successfully created',
    post,
  })
};

const deletePost = (request, response, next) => {
  const { id } = request.params;

  const post = posts.find(post => post._id === id);
  posts = posts.filter(post => post._id !== id);

  response.status(200).json({
    message: `Post with id: ${id} successfully deleted`,
    post,
  })
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
};
