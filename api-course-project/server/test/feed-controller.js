const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
// const Post = require('../models/post');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/feed-controller');

describe('Feed controller', () => {
  before(async () => {
    mongoose.connect('mongodb://localhost:27017/test_rest_blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({
      _id: '63ff5446fcb96f29f6832e97',
      email: 'john.doe@gmail.com',
      password: 'someFakePassword',
      name: 'John Doe',
      posts: [],
    });

    await user.save();
  });

  after(async () => {
    User.deleteMany();
    await mongoose.disconnect();
  });

  it('should add a new post to the list of posts of the creator', async () => {
    const request = {
      body: {
        title: 'Test post title',
        content: 'Test Post content',
      },
      file: {
        path: 'someFakeFilePath',
      },
      userId: '63ff5446fcb96f29f6832e97',
    };

    const response = {
      status: function() {
        return this;
      },
      json: function() {},
    };
    
    const updatedUser = await createPost(request, response, () => {});
    console.log('updatedUser: ', updatedUser);

    expect(updatedUser).to.have.property('posts');
    expect(updatedUser.posts).to.have.length(1);
  });
});
