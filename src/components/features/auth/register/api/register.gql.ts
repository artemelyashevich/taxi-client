import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $isDriver: Boolean!) {
    register(input: { email: $email, password: $password, isDriver: $isDriver }) {
      accessToken
      refreshToken
    }
  }
`;
