const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type PostData {
    posts: [Post!]!
    totalItems: Int!
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    allposts(page: Int!): PostData!
    post(postId: ID!): Post!
    user: User!
  }

  type RootMutation {
    createUser(userInputData: UserInputData): User!
    createPost(postInputData: PostInputData): Post!
    updatePost(postId: ID!, postInputData: PostInputData): Post!
    deletePost(postId: ID!): Int!
    updateStatus(status: String!): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
