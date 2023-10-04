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

# ENDPOINTS

To view the detailed API endpoints documentation, please refer to the [ENDPOINTS.md](./ENDPOINTS.md) file.

---

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
