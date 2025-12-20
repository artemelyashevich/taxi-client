import {gql} from "@apollo/client";

// It's good practice to name your queries (e.g., GetCurrentUser)
export const CURRENT_USER = gql`
  query GetCurrentUser {
    findCurrentUser {
      email
      role
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $isDriver: Boolean!) {
    register(input: { email: $email, password: $password, isDriver: $isDriver }) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const CREATE_TAXI = gql`
 mutation CreateTaxi($driverName: String!, $licensePlate: String!, $carNumber: String!, $latitude: Float!, $longitude: Float!) {
 createTaxi(input: {driverName: $driverName, licensePlate: $licensePlate, carNumber: $carNumber, latitude: $latitude, longitude: $longitude}) {
    driverName
    id
    isAvailable
    licensePlate
    carNumber
 }
 }
`

