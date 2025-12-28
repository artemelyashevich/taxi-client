import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $isDriver: Boolean!) {
    register(input: { email: $email, password: $password, isDriver: $isDriver }) {
      accessToken
      refreshToken
    }
  }
`