import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`