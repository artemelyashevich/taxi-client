import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query GetCurrentUser {
    findCurrentUser {
      id
      email
      role
    }
  }
`;