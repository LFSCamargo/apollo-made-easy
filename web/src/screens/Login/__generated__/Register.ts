/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "AuthenticationOutput";
  token: string | null;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  name: string;
  email: string;
  password: string;
}
