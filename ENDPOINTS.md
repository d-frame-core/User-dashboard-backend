<!-- @format -->

## File Name: user.route.ts

### File Description:

This file defines the routes for user-related operations in the API.

### File Endpoints:

#### 1. POST /api/signup/:publicAddress

**Endpoint Description:**
Create a new user with a unique public address.

**Endpoint URL:**

```
POST http://localhost:3000/api/signup/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
POST http://localhost:3000/api/signup/0x123456789abcdef

// Response (Status Code: 201 Created)
{
  "publicAddress": "0x123456789abcdef",
  // Other user properties
}
```

#### 2. GET /api/get/:publicAddress

**Endpoint Description:**
Retrieve user information by their public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/get/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/get/0x123456789abcdef

// Response (Status Code: 200 OK)
{
  "user": {
    // User details
  },
  "token": "JWT_TOKEN"
}
```

#### 3. PATCH /api/referral/:publicAddress

**Endpoint Description:**
Update a user's referral information.

**Endpoint URL:**

```
PATCH http://localhost:3000/api/referral/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
PATCH http://localhost:3000/api/referral/0x123456789abcdef

// Request Body
{
  "referral": "new_referral_code"
}

// Response (Status Code: 201 Created)
{
  "publicAddress": "0x123456789abcdef",
  // Updated user properties
}
```

#### 4. GET /api/users/getall

**Endpoint Description:**
Retrieve a list of all users.

**Endpoint URL:**

```
GET http://localhost:3000/api/users/getall
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/users/getall

// Response (Status Code: 200 OK)
[
  {
    // User 1 details
  },
  {
    // User 2 details
  },
  // ...
]
```

#### 5. DELETE /api/delete/:publicAddress

**Endpoint Description:**
Delete a user by their public address.

**Endpoint URL:**

```
DELETE http://localhost:3000/api/delete/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
DELETE http://localhost:3000/api/delete/0x123456789abcdef

// Response (Status Code: 200 OK)
{
  "message": "User deleted successfully"
}
```

#### 6. DELETE /api/delete/all

**Endpoint Description:**
Delete all users in the database.

**Endpoint URL:**

```
DELETE http://localhost:3000/api/delete/all
```

**Endpoint Example:**

```typescript
// Request
DELETE http://localhost:3000/api/delete/all

// Response (Status Code: 200 OK)
{
  "message": "All users deleted successfully"
}
```

#### 7. PATCH /api/update-address/:publicAddress

**Endpoint Description:**
Update address1 and address2 for a user by their public address.

**Endpoint URL:**

```
PATCH http://localhost:3000/api/update-address/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
PATCH http://localhost:3000/api/update-address/0x123456789abcdef

// Request Body
{
  "address1": "New Address 1",
  "address2": "New Address 2"
}

// Response (Status Code: 200 OK)
{
  "message": "Address updated successfully"
}
```

---

## File Name: user.data.route.ts

### File Description:

This file defines the routes for managing user data associated with user public addresses.

### File Endpoints:

#### 1. POST /api/user-data/:publicAddress

**Endpoint Description:**
Create or update user data for a specific public address and dataDate.

**Endpoint URL:**

```
POST http://localhost:3000/api/user-data/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
POST http://localhost:3000/api/user-data/0x123456789abcdef

// Request Body
{
  "dataDate": "2023-10-04",
  "urlData": {
    "urlLink": "https://example.com",
    "timestamps": ["timestamp1", "timestamp2"]
  }
}

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  // Updated user data properties
}
```

#### 2. GET /api/user-data/:publicAddress

**Endpoint Description:**
Retrieve user data associated with a specific public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/user-data/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/user-data/0x123456789abcdef

// Response (Status Code: 200 OK)
[
  {
    "dataDate": "2023-10-04",
    "urlData": [
      {
        "urlLink": "https://example.com",
        "timestamps": ["timestamp1", "timestamp2"]
      }
      // Other URL data entries for the date
    ]
  }
  // Other user data entries for different dates
]
```

#### 3. DELETE /api/user-data/:publicAddress

**Endpoint Description:**
Delete all user data associated with a specific public address.

**Endpoint URL:**

```
DELETE http://localhost:3000/api/user-data/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
DELETE http://localhost:3000/api/user-data/0x123456789abcdef

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  // Cleared user data properties
}
```

#### 4. GET /api/user-data/specific/:publicAddress

**Endpoint Description:**
Retrieve user data for a specific dataDate associated with a public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/user-data/specific/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/user-data/specific/0x123456789abcdef

// Request Body
{
  "date": "2023-10-04"
}

// Response (Status Code: 200 OK)
{
  "dataDate": "2023-10-04",
  "urlData": [
    {
      "urlLink": "https://example.com",
      "timestamps": ["timestamp1", "timestamp2"]
    }
    // Other URL data entries for the date
  ]
}
```

#### 5. DELETE /api/user-data/specific/:publicAddress

**Endpoint Description:**
Delete user data for a specific dataDate associated with a public address.

**Endpoint URL:**

```
DELETE http://localhost:3000/api/user-data/specific/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
DELETE http://localhost:3000/api/user-data/specific/0x123456789abcdef

// Request Body
{
  "date": "2023-10-04"
}

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  // Updated user data properties after data deletion
}
```

---

## File Name: learnmore.route.ts

### File Description:

This file defines a single API endpoint to retrieve information about "Learn More" content.

### File Endpoints:

#### 1. GET /api/learnmore/getall

**Endpoint Description:**
Retrieve all "Learn More" content entries.

**Endpoint URL:**

```
GET http://localhost:3000/api/learnmore/getall
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/learnmore/getall

// Response (Status Code: 200 OK)
[
  {
    // Learn More content entry 1
  },
  {
    // Learn More content entry 2
  }
  // Other Learn More content entries
]
```

---

## File Name: kyc1.route.ts

### File Description:

This file defines API endpoints for managing KYC1 (Know Your Customer) data associated with user public addresses.

### File Endpoints:

#### 1. PATCH /api/kyc1/:publicAddress

**Endpoint Description:**
Update KYC1 details for a user by their public address.

**Endpoint URL:**

```
PATCH http://localhost:3000/api/kyc1/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
PATCH http://localhost:3000/api/kyc1/0x123456789abcdef

// Request Body
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "123-456-7890",
  "email": "john@example.com",
  "userName": "johndoe"
}

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  // Updated user and KYC1 properties
}
```

#### 2. GET /api/kyc1/:publicAddress

**Endpoint Description:**
Retrieve user details, including KYC1 data, for a specific public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc1/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc1/0x123456789abcdef

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "123-456-7890",
  "email": "john@example.com",
  "kyc1": {
    "status": true,
    "verified": false,
    "details": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "123-456-7890",
      "email": "john@example.com",
      "userName": "johndoe"
    }
  }
}
```

#### 3. GET /api/kyc1/getsubmitted

**Endpoint Description:**
Retrieve users with KYC1 data submitted but not verified.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc1/getsubmitted
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc1/getsubmitted

// Response (Status Code: 200 OK)
[
  {
    "publicAddress": "0x123456789abcdef",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "123-456-7890",
    "email": "john@example.com",
    "kyc1": {
      "status": true,
      "verified": false,
      "details": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "123-456-7890",
        "email": "john@example.com",
        "userName": "johndoe"
      }
    }
  }
  // Other users with submitted KYC1 data
]
```

#### 4. GET /api/kyc1/getverified

**Endpoint Description:**
Retrieve verified users with KYC1 data.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc1/getverified
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc1/getverified

// Response (Status Code: 200 OK)
[
  {
    "publicAddress": "0x123456789abcdef",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "123-456-7890",
    "email": "john@example.com",
    "kyc1": {
      "status": true,
      "verified": true,
      "details": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "123-456-7890",
        "email": "john@example.com",
        "userName": "johndoe"
      }
    }
  }
  // Other verified users with KYC1 data
]
```

---

## File Name: kyc2.route.ts

### File Description:

This file defines API endpoints for managing KYC2 (Know Your Customer - Part 2) data associated with user public addresses.

### File Endpoints:

#### 1. PATCH /api/kyc2/:publicAddress

**Endpoint Description:**
Update KYC2 details for a user by their public address.

**Endpoint URL:**

```
PATCH http://localhost:3000/api/kyc2/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
PATCH http://localhost:3000/api/kyc2/0x123456789abcdef

// Request Body
{
  "gender": "Male",
  "country": "United States",
  "state": "California",
  "city": "San Francisco",
  "street": "123 Main St",
  "doorno": "Apt 101",
  "pincode": "94105",
  "dob": "1990-01-01",
  "annualIncome": 60000,
  "permanentAddress": "456 Elm St, Apt 202, 94110"
}

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  // Updated user and KYC2 properties
}
```

#### 2. GET /api/kyc2/:publicAddress

**Endpoint Description:**
Retrieve user details, including KYC2 data, for a specific public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc2/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc2/0x123456789abcdef

// Response (Status Code: 200 OK)
{
  "publicAddress": "0x123456789abcdef",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "123-456-7890",
  "email": "john@example.com",
  "kyc2": {
    "status": true,
    "verified": false,
    "details": {
      "gender": "Male",
      "country": "United States",
      "state": "California",
      "city": "San Francisco",
      "street": "123 Main St",
      "doorno": "Apt 101",
      "pincode": "94105",
      "dob": "1990-01-01",
      "annualIncome": 60000,
      "permanentAddress": "456 Elm St, Apt 202, 94110"
    }
  }
}
```

#### 3. GET /api/kyc2/getsubmitted

**Endpoint Description:**
Retrieve users with KYC2 data submitted but not verified.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc2/getsubmitted
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc2/getsubmitted

// Response (Status Code: 200 OK)
[
  {
    "publicAddress": "0x123456789abcdef",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "123-456-7890",
    "email": "john@example.com",
    "kyc2": {
      "status": true,
      "verified": false,
      "details": {
        "gender": "Male",
        "country": "United States",
        "state": "California",
        "city": "San Francisco",
        "street": "123 Main St",
        "doorno": "Apt 101",
        "pincode": "94105",
        "dob": "1990-01-01",
        "annualIncome": 60000,
        "permanentAddress": "456 Elm St, Apt 202, 94110"
      }
    }
  }
  // Other users with submitted KYC2 data
]
```

#### 4. GET /api/kyc2/getverified

**Endpoint Description:**
Retrieve verified users with KYC2 data.

**Endpoint URL:**

```
GET http://localhost:3000/api/kyc2/getverified
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/kyc2/getverified

// Response (Status Code: 200 OK)
[
  {
    "publicAddress": "0x123456789abcdef",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "123-456-7890",
    "email": "john@example.com",
    "kyc2": {
      "status": true,
      "verified": true,
      "details": {
        "gender": "Male",
        "country": "United States",
        "state": "California",
        "city": "San Francisco",
        "street": "123 Main St",
        "doorno": "Apt 101",
        "pincode": "94105",
        "dob": "1990-01-01",
        "annualIncome": 60000,
        "permanentAddress": "456 Elm St, Apt 202, 94110"
      }
    }
  }
  // Other verified users with KYC2 data
]
```

---

## File Name: image.route.ts

### File Description:

This file defines API endpoints for uploading, retrieving, and updating profile images associated with user public addresses. It utilizes the Multer middleware for handling file uploads and interactions with the server's file system.

### File Endpoints:

#### 1. POST /api/profile-image/:publicAddress

**Endpoint Description:**
Upload a profile image for a user by their public address.

**Endpoint URL:**

```
POST http://localhost:3000/api/profile-image/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
POST http://localhost:3000/api/profile-image/0x123456789abcdef

// Request Body (Form Data)
{
  "image": (file) // Upload an image file (jpg, jpeg, or png)
}

// Response (Status Code: 200 OK)
{
  "message": "Profile picture uploaded successfully",
  "data": {
    "imageUrl": "http://localhost:3000/uploads/profile/0x123456789abcdef.jpg"
  }
}
```

#### 2. GET /api/profile-image/:publicAddress

**Endpoint Description:**
Retrieve the user's profile image by their public address.

**Endpoint URL:**

```
GET http://localhost:3000/api/profile-image/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/profile-image/0x123456789abcdef

// Response (Status Code: 200 OK)
// Image binary data
```

#### 3. PATCH /api/profile-image/:publicAddress

**Endpoint Description:**
Update the user's profile image by their public address.

**Endpoint URL:**

```
PATCH http://localhost:3000/api/profile-image/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
PATCH http://localhost:3000/api/profile-image/0x123456789abcdef

// Request Body (Form Data)
{
  "image": (file) // Upload a new image file (jpg, jpeg, or png)
}

// Response (Status Code: 200 OK)
{
  "message": "Profile picture updated successfully",
  "data": {
    "imageUrl": "http://localhost:3000/uploads/profile/0x123456789abcdef.jpg"
  }
}
```

---

## File Name: help.route.ts

### File Description:

This file defines an API endpoint to retrieve a list of help-related information. It allows clients to fetch all available help resources.

### File Endpoints:

#### 1. GET /api/help/getall

**Endpoint Description:**
Retrieve all available help resources.

**Endpoint URL:**

```
GET http://localhost:3000/api/help/getall
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/help/getall

// Response (Status Code: 200 OK)
[
  {
    // Help resource 1 details
  },
  {
    // Help resource 2 details
  },
  // ...more help resources
]
```

---

## File Name: faq.route.ts

### File Description:

This file defines an API endpoint to retrieve a list of frequently asked questions (FAQs). It allows clients to fetch all available FAQs.

### File Endpoints:

#### 1. GET /api/faq/getall

**Endpoint Description:**
Retrieve all available frequently asked questions (FAQs).

**Endpoint URL:**

```
GET http://localhost:3000/api/faq/getall
```

**Endpoint Example:**

```typescript
// Request
GET http://localhost:3000/api/faq/getall

// Response (Status Code: 200 OK)
[
  {
    // FAQ 1 details
  },
  {
    // FAQ 2 details
  },
  // ...more FAQs
]
```

---

## File Name: address.route.ts

### File Description:

This file defines an API endpoint to handle the uploading of address proof images. It allows clients to submit multiple images as address proof for a specific user.

### File Endpoints:

#### 1. POST /api/address-proof/:publicAddress

**Endpoint Description:**
Upload address proof images for a user.

**Endpoint URL:**

```
POST http://localhost:3000/api/address-proof/:publicAddress
```

**Endpoint Example:**

```typescript
// Request
POST http://localhost:3000/api/address-proof/user123

// Request Body (Form Data)
{
  images: [File1, File2] // Multiple image files
}

// Response (Status Code: 200 OK)
{
  message: 'Images uploaded successfully',
  data: [
    'http://localhost:3000/uploads/address/user123-0.jpg',
    'http://localhost:3000/uploads/address/user123-1.jpg'
  ]
}
```

**Notes:**

- This endpoint expects a `multipart/form-data` request with the field name `images` containing one or more image files (e.g., JPG, JPEG, PNG).
- It saves the uploaded images and generates unique URLs for each uploaded image.
- The images are associated with a specific user identified by `publicAddress`.
