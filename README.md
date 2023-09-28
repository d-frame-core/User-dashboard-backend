<!-- @format -->

# D FRAME USER BACKEND ALPHA GUIDE

This repository contains a guide for the user backend alpha of D FRAME.

## Folder Structure

- `config`: Checks for configuration in the environment file.
- `models`: Contains MongoDB schemas.
- `services`: Includes admin services.
- `utils`: Consists of AES and API error files.
- `api`: Contains all API routes.
  - `admin`: Routes for admin.
  - `blockchain-ingestion`: JSON ABI file.
  - `user`: All user routes.

## How to Setup

1. Clone the LATEST repo of user-backend from [here](https://github.com/d-frame-core/User-dashboard-backend).

2. Create a `.env` file and fill the following content:

   ```plaintext
   NODE_ENV="development"
   DEV_MONGOOSE_URI_DB=""
   POLYGON_RPC_URL=""
   POLYGON_CHAIN_ID=""
   MAGIC_PUBLISHABLE_KEY=""
   MAGIC_SECRET_KEY=""
   DEV_PORT=
   AES_GCM_KEY=""
   MONGOSTRING=""
   ```

3. After setting up the `.env` file and pasting the content, run the following commands:

   ```bash
   yarn
   yarn start
   ```

   If any errors persist, please contact the team.

---

## Tech Stack

- [@magic-sdk/admin](https://www.npmjs.com/package/@magic-sdk/admin)
- [cors](https://www.npmjs.com/package/cors)
- [cron](https://www.npmjs.com/package/cron)
- [express](https://expressjs.com/)
- [kafkajs](https://www.npmjs.com/package/kafkajs)
- [mongoose](https://mongoosejs.com/)
- [node-rdkafka](https://www.npmjs.com/package/node-rdkafka)
- [passport-magic](https://www.npmjs.com/package/passport-magic)
- [typescript](https://www.typescriptlang.org/)
- [web3](https://web3js.readthedocs.io/en/v1.3.7/)

## Endpoints

Base URL: `http://localhost:3000`

### User Endpoints

- `GET /api/user/update-email`

  - **Description:** This endpoint is used to update the email address associated with a user's account. It requires a user's Digital Identity (DID) token for authorization. The email is updated in the database based on the user's public address obtained from the DID token.
  - **Example Usage:** `http://localhost:3000/api/user/update-email?email=newemail@example.com`

- `POST /api/user/profileData`

  - **Description:** This endpoint allows users to update their profile data. It expects a JSON payload containing user data. If the user's data does not exist in the database, a new record is created. Otherwise, the existing data is updated.
  - **Example Usage:** `http://localhost:3000/api/user/profileData`

**The above two endpoints not tested**

...............................

- `POST /api/user/updateProfileData/:publicAddress`

  - **Description:** This endpoint is used to update a user's profile data by specifying their public address as a parameter. It expects a JSON payload containing user data and updates the existing record.
  - **Example Usage:** `http://localhost:3000/api/user/updateProfileData/0x659664dd23937edee4f19366666666666D4c93e6`

    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "firstName": "abu",
    "lastName": "rasasa",
    "name": "jacob",
    "userName": "bile044",
    "address": "India",
    "phoneNumber": "7388240798",
    "isActive": true,
    "isEmailVerified": true,
    "email": "ayaanbase@gmail.com",
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6",
    "earnings": "0"
  }
  ```

- `GET /api/users/detail/:publicAddress`

  - **Description:** This endpoint retrieves user details based on their public address. It returns information about the user if found, and a "User not found" message if the user does not exist.
  - **Example Usage:** `http://localhost:3000/api/users/detail/0x659664dd23937edee4f19366666666666D4c93e6`

- `POST /api/users/userdata`

  - **Description:** This endpoint is used to add user data to the MongoDB database. It expects a JSON payload containing user data and ensures that data is correctly associated with the user based on their public address.
  - **Example Usage:** `http://localhost:3000/api/users/userdata`

    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6",
    "data": {
      "dataDate": "27/09/23",
      "urlData": {
        "urlLink": "binance.com",
        "timestamps": ["11:54:00"],
        "tags": ["web3", "exchange"]
      }
    }
  }
  ```

- `DELETE /api/users/delete`

  - **Description:** This endpoint deletes a user from the backend based on their public address. It removes the user's data from the database.
  - **Example Usage:** `http://localhost:3000/api/users/delete`

    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6"
  }
  ```

- `GET /api/users/userdata/specific`

  - **Description:** This endpoint retrieves user data for a specific date. It requires the user's public address and the desired date as parameters.
  - **Example Usage:** `http://localhost:3000/api/users/userdata/specific`
    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6",
    "date": "27/09/23"
  }
  ```

- `DELETE /api/users/userdata/specific`

  - **Description:** This endpoint deletes user data for a specific date associated with a user's public address.
  - **Example Usage:** `http://localhost:3000/api/users/userdata/specific`
    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6",
    "date": "27/09/23"
  }
  ```

- `DELETE /api/users/userdata/delete`

  - **Description:** This endpoint deletes all user data associated with a given public address.
  - **Example Usage:** `http://localhost:3000/api/users/userdata/delete`
    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6"
  }
  ```

- `PATCH /api/users/detail/:publicAddress`

  - **Description:** This endpoint allows users to update their details. It takes the user's public address as a parameter and expects a JSON payload containing the updated user data.
  - **Example Usage:** `http://localhost:3000/api/users/detail/0x659664dd23937edee4f19366666666666D4c93e6`
    **Make sure to pass the following entry points JSON in the request body(EXAMPLE CODE BELOW):**

  ```json
  {
    "publicAddress": "0x659664dd23937edee4f19366666666666D4c93e6",
  }
  (this will edit user address, pass ANY param which you want to edit like address , firstName to edit that specifically)
  ```

These endpoints provide various functionalities for user management and data handling in the D FRAME user backend.

## Testing Software

You can use ThunderClient, a powerful REST client extension for VS Code, to test and interact with these API endpoints.

[Download ThunderClient](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)

**Download Postman:**

Alternatively, you can also use Postman, a popular API testing tool, for testing these endpoints.

[Download Postman](https://www.postman.com/downloads/)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

**MAKE SURE TO GO THROUGH the MODELS and ROUTE folder carefully to understand the code logic**

**MAKE SURE TO EXPAND THIS README GUIDE FOR THE CHANGES MADE BY YOU SO IT IS UP TO DATE**

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
