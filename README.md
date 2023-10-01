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

## ENDPOINTS

### User Routes (`user.route.ts`)

#### 1. Sign Up

- **Route:** `POST /api/signup/:publicAddress`
- **Description:** Creates a new user with the specified `publicAddress`. If the user already exists, it returns an error.
- **Example Usage:** `http://localhost:3000/api/signup/0x659664dd23937edee4f19000066666666D4c93e6`

#### 2. Get User Details

- **Route:** `GET /api/get/:publicAddress`
- **Description:** Retrieves user details based on the provided `publicAddress`. If the user does not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/get/0x659664dd23937edee4f19000066666666D4c93e6`

#### 3. Get All Users

- **Route:** `GET /api/users/getall`
- **Description:** Retrieves user details from MongoDB. If there are no users, it returns an empty object.
- **Example Usage:** `http://localhost:3000/api/users/getall`

#### 4. Delete User by Public Address

- **Route:** `DELETE /api/delete/:publicAddress`
- **Description:** Deletes a user based on the provided `publicAddress`. If the user does not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/delete/0x659664dd23937edee4f19000066666666D4c93e6`

#### 5. Delete All Users

- **Route:** `DELETE /api/delete/all`
- **Description:** Deletes all users from the database.
- **Example Usage:** `http://localhost:3000/api/delete/all`

---

### KYC1 Routes (`kyc1.route.ts`)

#### 1. Update KYC1 Details

- **Route:** `PATCH /api/kyc1/:publicAddress`
- **Description:** Updates KYC1 details (first name, last name, phone number, email, and username) for the user with the specified `publicAddress`. If the user does not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc1/0x659664dd23937edee4f19000066666666D4c93e6`

#### 2. Get KYC1 Details

- **Route:** `GET /api/kyc1/:publicAddress`
- **Description:** Retrieves KYC1 details for the user with the provided `publicAddress`. If the user or KYC1 details do not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc1/0x659664dd23937edee4f19000066666666D4c93e6`

#### 3. Get Submitted KYC1 Users

- **Route:** `GET /api/kyc1/getsubmitted`
- **Description:** Retrieves users with KYC1 submitted but not verified.
- **Example Usage:** `http://localhost:3000/api/kyc1/getsubmitted`

#### 4. Get Verified KYC1 Users

- **Route:** `GET /api/kyc1/getverified`
- **Description:** Retrieves verified users with KYC1.
- **Example Usage:** `http://localhost:3000/api/kyc1/getverified`

---

### KYC2 Routes (`kyc2.route.ts`)

#### 1. Update KYC2 Details

- **Route:** `PATCH /api/kyc2/:publicAddress`
- **Description:** Updates KYC2 details (gender, country, state, city, street, doorno, pincode, dob, annualIncome, and permanentAddress) for the user with the specified `publicAddress`. If the user does not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc2/0x659664dd23937edee4f19000066666666D4c93e6`

#### 2. Get KYC2 Details

- **Route:** `GET /api/kyc2/:publicAddress`
- **Description:** Retrieves KYC2 details for the user with the provided `publicAddress`. If the user or KYC2 details do not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc2/0x659664dd23937edee4f19000066666666D4c93e6`

#### 3. Get Submitted KYC2 Users

- **Route:** `GET /api/kyc2/getsubmitted`
- **Description:** Retrieves users with KYC2 submitted but not verified.
- **Example Usage:** `http://localhost:3000/api/kyc2/getsubmitted`

#### 4. Get Verified KYC2 Users

- **Route:** `GET /api/kyc2/getverified`
- **Description:** Retrieves verified users with KYC2.
- **Example Usage:** `http://localhost:3000/api/kyc2/getverified`

---

### KYC3 Routes (`kyc3.route.ts`)

#### 1. Update KYC3 Details

- **Route:** `PATCH /api/kyc3/:publicAddress`
- **Description:** Updates KYC3 details, including uploading photos and government ID images for the user with the specified `publicAddress`. If the user does not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc3/0x659664dd23937edee4f19000066666666D4c93e6`

#### 2. Get KYC3 Details

- **Route:** `GET /api/kyc3/:publicAddress`
- **Description:** Retrieves KYC3 details for the user with the provided `publicAddress`. If the user or KYC3 details do not exist, it returns an error.
- **Example Usage:** `http://localhost:3000/api/kyc3/0x659664dd23937edee4f19000066666666D4c93e6`

---

### User Data Routes (`user.data.route.ts`)

#### 1. Add User Data

- **Route:** `POST /api/user-data/:publicAddress`
- **Description:** Adds user data for a specific date. If data for the same date exists, it updates it.
- **Example Usage:** `http://localhost:3000/api/user-data/0x659664dd23937edee4f19000066666666D4c93e6`

#### 2. Get User Data

- **Route:** `GET /api/user-data/:publicAddress`
- **Description:** Retrieves all user data for the specified user.
- **Example Usage:** `http://localhost:3000/api/user-data/0x659664dd23937edee4f19000066666666D4c93e6`

#### 3. Delete User Data

- **Route:** `DELETE /api/user-data/:publicAddress`
- **Description:** Deletes all user data for the specified user.
- **Example Usage:** `http://localhost:3000/api/user-data/0x659664dd23937edee4f19000066666666D4c93e6`

---

Please make sure to update and customize the documentation according to your specific needs, including any additional details or authentication requirements.

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
