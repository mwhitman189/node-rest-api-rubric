# Node RESTful API Rubric
This is a prescriptive guide on quickly setting up a Node.js RESTful API.

Thank you to [Academind](https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w)'s superb series on the topic.

## Process
1. Install dependencies:
   - bcrypt: Hash, and compare hashed, passwords
   - body-parser: Parse incoming request bodies (req.body)
   - express: Web framework
   - jsonwebtoken: Implement JSON Web Tokens
   - mongoose: MongoDb object modeler
   - morgan: HTTP request logger middleware for handling JWTs
   - multer: Middleware to handling multipart/form-data, used for uploading files (images)
   - nodemon: Tool for automating restart of server on file changes  
    `npm install bcrypt body-parser express jsonwebtoken mongoose morgan multer --save`  
    `npm install nodemon --save-dev`

## Running the server
`npm start`

## Auth API
`POST /login` requires "email" and "password" in the request body. If the user is authenticated,
an `accessToken` and a `refreshToken` will be returned.

`POST /token` requires the `refreshToken` received during login, and returns a new `accessToken`.

`GET /logout` removes the `refreshToken`, and logs the user out.