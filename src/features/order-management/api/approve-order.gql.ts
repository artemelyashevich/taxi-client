import { gql } from "@apollo/client";

export const APPROVE_ORDER = gql`
  mutation APPROVE_ORDER($input: OrderApprovement!) {
    approveOrder(input: $input)
  }
`;