import { gql } from 'apollo-server';

export default gql`
  type Post {
    _id: String
    title: String
    description: String
    user: User
    postLikes: [String]
    likesCount: Int
    active: Boolean
    createdAt: String
    updatedAt: String
    liked: Boolean
  }

  type PostConnectionOutput {
    count: Int
    edges: [Post]
    hasNextPage: Boolean
  }
`;
