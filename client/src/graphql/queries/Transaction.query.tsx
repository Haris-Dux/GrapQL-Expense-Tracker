
import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
query GETTRANSACTIONS {
    transactions{
      id
      description
      paymentType
      category
      location
      date
      amount
      userId
    }
}`;

export const GET_TRANSACTION_BY_ID = gql`
query GETTRANSACTIONBYID($transactionId:ID!) {
  getTransaction(transactionId:$transactionId) {
    id
    userId
    description
    paymentType
    category
    location
    date
    amount
  }
}`

export const GET_TRANSACTION_STATISTICS = gql`
query GETTRANSACTIONSTATISTICS{
  getTransactionStatistics{
    category
    totalAmount
  }
}`