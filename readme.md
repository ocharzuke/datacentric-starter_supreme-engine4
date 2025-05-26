# Datacentric Practical Assessment

Take some time to read through the `index.js` file and take note of the function names and wherever there are lines that say `TODO:`. You will have to complete all the `TODO` tasks and fix any outstanding bugs to get the assessment to work.

It is highly suggested that you go through the last of tasks below to implement all the `TODO`.

## Task 1: Set up the Mongo Database
See `testing.md` and follow all the steps in under `Setup Instructions`

## Task 2: Finish the `connect` function
The `connect` function should create a connecction to the Mongo database. Write the code to create a new Mongo DB connection using the `uri` and `dbname` parameters.

## Task 3: Implement getting all movies and demonstrate understanding of projection
For the `GET /movies` route, get all the movies from the relevant MongoDB collection and send it back in the JSON format. Remember to use projection to include the fields that you want to return.

## Task 4: Implement getting a movie by its _id
For the `GET /movies/:id` route, finish the `TODO` so that you can retrieve one movie document.

## Task 5: Implement searching
Finish each of the `TODO` in the `/movies/search` so that the user can perform a search for movies.

## Task 6: Implement adding a new movie
Read the function for the `POST /movies` route carefully, taking note of which variables are being used and what they do. The given code will find the genre and categories specified in the request body.

Finish the two `TODOs` so that the user can add a new movie.

## Task 7: Implement updating an existing movie
Read the function for the `PUT /movies/id` carefully. Take note of the `id` that is extracted from `req.query`. Finish the two `TODO` so that the user can update a document by its id.

## Task 8: Implement creating a new user
Finish the two `TODO` in the `POST /users` route so that a new user can register.  See `testing.md`, under the `Authentication` section, to see what data is expected in the request's body. Make sure the user's password is **hashed** before saving to the collection!

## Task 9: Implement logging in
FInish the `TODO` in the `POST /login` route so that when the user has logged in, you will create an access token. You will need to finish the `TODO` in the `generateAccessToken` function as well.