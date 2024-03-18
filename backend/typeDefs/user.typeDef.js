

const userTypeDef = `#graphql

type User {
    id:ID!
    name: String!
    userName: String!
    password: String!
    gender: String!
    profilePicture:String!
    transactions:[Transactions!]
}

type Query {
    authUser : User
    User(userId:ID!) : User
}

type Mutation {
    signUp(input:signUpInput!):User!
    login(input:loginInput!):User!
    logout:LogoutResponse
}

input signUpInput {
    name: String!
    userName: String!
    password: String!
    gender: String!
}

input loginInput {
    userName: String!
    password: String!
}

type LogoutResponse {
    message: String!
}

`
export default userTypeDef;