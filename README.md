# Postly

## Overview
Postly is a social media backend application built with Node.js, Express, and MongoDB. It allows users to create and manage posts, interact through likes and comments, follow other users, receive notifications, and manage bookmarks. The project is designed using a modular monolithic architecture with a focus on scalable RESTful API development and clean backend practices.

## Features
- User authentication and authorization using JWT
- Create, update, and delete posts
- Upload post images using Multer and Cloudinary
- Like and unlike posts
- Comment system with populated user data
- Follow and unfollow users
- Bookmark posts
- Notification system for likes, comments, and follows
- Pagination, filtering, sorting, and field limiting
- Secure RESTful API architecture

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer
- Cloudinary
- Joi validation

## API Documentation
The API documentation is available at the following link: [View Postman API Documentation](https://documenter.getpostman.com/view/37706685/2sBXqNmdeH)

It includes all available endpoints such as authentication, posts, comments, likes, bookmarks, follows, and notifications, along with request and response examples.

## Installation

1. Clone the repository:  
   `git clone https://github.com/bavlysafwatt/postly.git`

2. Install dependencies:  
   `npm install`

3. Create a `.env` file and configure the following variables:
    ```env
    NODE_ENV=development
    PORT=3000
    DATABASE=<your-database-url>

    SECRET_KEY=<your-secret-key>
    JWT_EXPIRES_IN=90d

    CLOUDINARY_CLOUD_NAME=<your-cloud-name>
    CLOUDINARY_API_KEY=<your-api-key>
    CLOUDINARY_API_SECRET=<your-api-secret>
    ```

4. Run the application:  
   `npm start`

## Notes
- Ensure MongoDB is running before starting the application.
- This project is intended for learning and portfolio purposes.
- The project follows a modular monolithic architecture.
