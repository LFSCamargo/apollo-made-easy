/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPost
// ====================================================

export interface AddPost_addPost_user {
  __typename: "User";
  email: string | null;
}

export interface AddPost_addPost {
  __typename: "Post";
  _id: string | null;
  title: string | null;
  description: string | null;
  user: AddPost_addPost_user | null;
}

export interface AddPost {
  addPost: AddPost_addPost | null;
}

export interface AddPostVariables {
  title: string;
  description: string;
}
