import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
mutation SIGNUPUSER ($input:signUpInput!) {
    signUp(input:$input){
        id
        userName
        name
        gender
        profilePicture
    }
}`;

export const LOGOUT_USER = gql`
mutation LOOUT {
    logout {
        message
    }
}`;

export const LOGIN_USER = gql`
mutation LOINUSER ($input:loginInput!) {
    login (input:$input) {
        id
        userName
        name
        gender
        profilePicture
    }
}`;