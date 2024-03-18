import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GETAUTHENTICATEDUSER {
    authUser {
      id
      userName
      profilePicture
      gender
    }
  }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
  query GETUSERANDTRANSACTIONS($userId: ID!) {
    User(userId: $userId) {
      id
      userName
      profilePicture
      gender
      transactions {
        id
        userId
        description
        paymentType
        category
        location
        date
        amount
      }
    }
  }
`;
