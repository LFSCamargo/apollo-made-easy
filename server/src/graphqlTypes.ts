import { PubSub, gql } from 'apollo-server';
import userTypes from './modules/user/userType';
import { User } from './modules/user/userModel';
import postType from './modules/posts/postType';

export interface GraphQLContext {
  user: User,
  pubsub: PubSub,
}

const graphqlTypes = gql`
  type DeleteReturn {
    message: String
  }

  type NotificationArrivedOutput {
    user: User
    post: Post
    text: String
  }

  type PostAdded {
    post: Post
  }

  type Subscription {
    notificationArrived(yourUser: String!): NotificationArrivedOutput
    postAdded: PostAdded
  }

  type Mutation {
    register(name: String, email: String, password: String): AuthenticationOutput
    login(email: String, password: String): AuthenticationOutput

    addPost(title: String, description: String): Post
    deletePost(_id: String!): DeleteReturn
    likePost(_id: String!): Post
  }

  type Query {
    me: User
    user(_id: String!): User
    users(search: String, first: Int, after: Int): UserConnectionOutput

    post(_id: String!): Post
    posts(search: String, first: Int, after: Int): PostConnectionOutput
  }
`;

export default [graphqlTypes, userTypes, postType];
