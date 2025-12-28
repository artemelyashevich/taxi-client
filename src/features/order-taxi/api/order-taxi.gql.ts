import { gql } from "@apollo/client";

export const BOOK_CAR = gql`
  mutation BOOK_CAR($input: OrderInput!) {
    placeOrder(input: $input) {
      id
      orderStatus
    }
  }
`;