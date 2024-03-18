const transactionTypeDef = `#graphql

type Transactions {
    id:String!
    userId:ID!
    description: String!
    paymentType: String!
    category: String!
    location: String!
    date:String
    amount:Float!
    success:Boolean!
}

type Query {
    transactions:[Transactions!]
    getTransaction(transactionId: ID!): Transactions!
    getTransactionStatistics:[CategoryStatistics!]
}

type Mutation {
    createTransaction(input:createTransactionInput!):Transactions!  
    updateTransaction(input:updateTransactionInput!):Transactions!
    deleteTransaction(transactionId:ID!):Transactions!
}

type CategoryStatistics {
    category:String!
    totalAmount:String!
}

input createTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    location: String
    date:String!
    amount:Float!
}

input updateTransactionInput {
    transactionId:ID!
    description: String!
    paymentType: String!
    category: String!
    location: String
    date:String!
    amount:Float!
}
`
export default transactionTypeDef;