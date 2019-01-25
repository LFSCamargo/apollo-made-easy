/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Landing
// ====================================================

export interface Landing_posts_edges_user {
  __typename: "User";
  email: string | null;
}

export interface Landing_posts_edges {
  __typename: "Post";
  _id: string | null;
  title: string | null;
  description: string | null;
  user: Landing_posts_edges_user | null;
}

export interface Landing_posts {
  __typename: "PostConnectionOutput";
  count: number | null;
  hasNextPage: boolean | null;
  edges: (Landing_posts_edges | null)[] | null;
}

export interface Landing {
  posts: Landing_posts | null;
}

export interface LandingVariables {
  first?: number | null;
}
