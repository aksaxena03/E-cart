# E-commerce Backend

This is the backend service for a simple e-commerce application. It provides RESTful APIs for user authentication, product listing, cart management, and checkout functionality.

## Features

*   **User Authentication**: Secure signup and signin using JWT for session management.
*   **Password Security**: Passwords are hashed using `bcrypt` before being stored.
*   **Product Management**: API to fetch a list of available products.
*   **Shopping Cart**: Full CRUD functionality for a user's shopping cart.
*   **Checkout**: Simulate a checkout process, calculate the total, and clear the cart.
*   **Validation**: Robust input validation using Zod to ensure data integrity.

## Technology Stack

*   **Framework**: Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB with Mongoose
*   **Authentication**: JSON Web Tokens (JWT)
*   **Validation**: Zod
*   **Password Hashing**: bcrypt

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   bun
*   A running MongoDB instance (you can use a local installation or a cloud service like MongoDB Atlas).

### Installation

1.  Clone the repository to your local machine.
2.  Navigate into the `backend` directory:
    ```sh
    cd backend
    ```
3.  Install the dependencies:
    ```bash
    bun install
    ```

### Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following configuration variables.

```env
# Your MongoDB connection string
VITE_DB="mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority"

# Port for the server (optional, defaults to 3000)
PORT=3000

# A strong, unique secret for signing JWTs
JWT_SECRET="your_super_secret_jwt_key"

# Salt rounds for bcrypt hashing (optional, defaults to 10)
SALT_ROUNDS=10
```

### Running the Application

To start the development server, run:

```bash
bun run dev
```

The server will start, and you should see a confirmation message in the console:

```
MongoDB connected successfully
3000 at backend is listening
```

## API Endpoints

All endpoints are prefixed with `/`.

### Authentication

*   **`POST /auth/Signup`**: Register a new user.
    *   **Body**: `{ "username": "testuser", "email": "test@example.com", "password": "password123", "address": "123 Main St" }`
*   **`POST /auth/Signin`**: Log in an existing user and receive a JWT.
    *   **Body**: `{ "email": "test@example.com", "password": "password123" }`

### Products

*   **`GET /api/product`**: Get a list of all products.
*   **`POST /api/products`**: (Authenticated) A utility endpoint to populate the database with mock product data.

### Cart

*These endpoints require authentication. The JWT must be sent in the `Authorization` header as a Bearer token.*

*   **`GET /api/cart`**: Get all items in the current user's cart.
*   **`POST /api/cart`**: Add a product to the cart. If the product already exists, its quantity is incremented.
    *   **Body**: `{ "productId": "some_product_id", "quntity": 1 }`
*   **`DELETE /api/cart/:productId`**: Remove a specific product from the user's cart.

### Checkout

*   **`POST /api/checkout`**: (Authenticated) Simulates the checkout process. It calculates the total price of items in the cart, clears the cart, and returns a receipt.

### mock data
*   http://localhost:3000/mock