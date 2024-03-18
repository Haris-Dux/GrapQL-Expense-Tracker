import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation createTransaction ($input: createTransactionInput!) {
    createTransaction (input: $input) {
      id
      description
      paymentType
      category
      location
      date
      amount
    }
  }
`;

export const DELETE_TRANSACTION = gql`
mutation DELETETRANSACTION ($transactionId:ID!){
    deleteTransaction (transactionId:$transactionId){
      success
    }
}`;

export const UPDATE_TRANSACTION = gql`
mutation UPDATETRANSACTION ($input:updateTransactionInput!){
  updateTransaction(input:$input){
    id
  }
}`
