# Finance Management App

## Introduction

Zai Finance created an app to help its users organize their financial goals. By connected their bank account to the app they will able see if they are on track of their goals and make the right decision for them.

## Features
- create, update, and delete goals
- visual of the purchases organized by month and year
- visual of purchases and goal to provide an image if user is on the right path
- Responsive UI using Material UI library

### Architecture

- **Frontend**: React
- **Backend**: Node
- **Database** MongoDB


## API References

- `api/users/get-signup` : recieve the profile information to presented in the app from the database
- `api/banks/transactions` : a query that recieves data that is organized to work properly for the bar chart
- `api/auth/signup-fill` : recieve sign up data from user and store it
- `api/auth/log` : recieve log in data to create authorization token that will be stored 
- `api/plaid/create-link-token` : create token for exchange for access token.
- `api/plaid/exchange-public-token` : use the local token to exchange for the access token in plaid.
- `api/plaid/get-plaid-transactions` : get the transactions from plaid that is connected to the bank account then
save it to the transaction model, once that is successful it will send back the transaction data for use

## Tech Stack
- Plaid
- React
- Node
- Chart
- MaterialUI
- MongoDB



