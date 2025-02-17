# Task Management Backend (Kazam Assignment)

This is the backend service for the **Task Management System**, designed to handle user authentication, task creation, and tracking. The backend is built using **Node.js, Express, Socket.io and MongoDB**.


## Table of contents

- [Project Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Middlewares](#middlewares)
- [How to Use](#how-to-use)
- [Future Enhancements](#future-enhancements)
- [Additional Features implementetion](#additional-features-implementetion)
- [Contact](#contact)



## Features
- User authentication (JWT-based login and registration)
- Task creation, updating, and deletion
- Task status tracking
- API endpoints for managing users and tasks
- Secure RESTful API with proper validation
- Real time implementation using socket.io


## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building the API.
- **MongoDB**: Database for storing users and reminders.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Secure token-based authentication.
- **Bcrypt**: Hashing library for passwords.
- **Cookie-parser**: Manage cookies for session handling.
- **Socket.io** - Real time implementation


## Folder Structure

```bash
├── config/
│   ├── dbConnection.ts         # Handles DB connection
├── controllers/
│   ├── authCountroller.ts      # Handles auth-related operations
│   ├── userController.ts       # Handles user-related operations
│   ├── taskController.ts       # Manages task-related actions
├── middlewares/
│   ├── authMiddleware.ts       # Handles JWT and token validation
│   ├── errorMiddleware.ts      # Handles error
├── models/
│   ├── blacklistModel.ts       # blacklist schema
│   ├── UserModel.ts            # User schema
│   ├── taskModel.ts            # task schema
├── routes/
│   ├── authRoutes.ts           # Auth related routes
│   ├── userRoutes.ts           # User related routes
│   ├── taskRoutes.ts           # task-related routes
├── utils/
│   ├── catchAsyncError.ts      # Handles async errors 
│   ├── ErrorHandler.ts         # Custom error handling class
├── .env                        # Environment variables
├── index.ts                    # handles socket implementation
├── socket.ts                    # Entry point of the application
└── package.json                # Dependencies and scripts
```





## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/AbhishekOraonDev/TaskManagement_Backend.git
   ```

2. **Navigate to the project directory:**
   ```sh
   cd <folder_name_if_exists> 
   ```

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Create a `.env` file and add environment variables:**
   ```env
    NODE_ENV=dev
    PORT=3000
    MONGO_URI=<YOUR_MONGO_URI>
    JWT_SECRET_KEY=<YOUR_JWT_SECRET_KEY>
    ORIGIN2=<YOUR_ORIGIN_URL>
    ORIGIN1=<YOUR_ORIGIN_URL>
   ```

5. **Start the development server:**
   ```sh
   npm run dev
   ```

## API Endpoints

### User Routes
- **POST** `/api/auth/login` - Login and receive a JWT token
- **POST** `/api/auth/logout` - Logout and delete a JWT token

### User Routes
- **POST** `/api/user/register` - Register a new user
- **PUT** `/api/user/edit` - Edit user (Protected)
- **GET** `/api/user/profile` - Get user profile (Protected)

### Task Routes
- **POST** `/api/task/create` - Create a new task (Protected)
- **GET** `/api/task/` - Get all tasks (Protected)
- **PUT** `/api/task/:taskId` - Update task (Protected)
- **DELETE** `/api/task/:taskId` - Delete task (Protected)

## Authentication
- The API uses JWT for authentication.
- Users must include a **Bearer Token** in the Authorization header for protected routes.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request


## Middlewares

1. Authorization Middleware:
    - Ensures routes are accessible only to authenticated users.
    - Verifies and decodes JWT tokens.
2. Error Handling Middleware:
    - Captures and formats all errors.



## How to Use

1. Register a new user via the /register endpoint.

2. Log in to generate a JWT and authenticate your session.

3. Use the token to access routes for managing tasks and user profiles.

4. Create, Edit, Delete, Fetch tasks.

5. Log out to invalidate your token and clear the session.




## Future Enhancements

1. Implementation of role-based access control (RBAC) for admin-level operations.

2. Add caching using redis.


 

## Contact
For any queries or issues, reach out to **[Abhishek Oraon](https://github.com/AbhishekOraonDev)**.

---
**Happy Coding! 🚀**

