// 1. SETUP EXPRESS
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbname = "cinemadb"; // CHANGED DATABASE NAME

// enable dotenv (allow Express application to read .env files)
require("dotenv").config();

// set the mongoUri to be MONGO_URI from the .env file
// make sure to read data from process.env AFTER `require('dotenv').config()`
const mongoUri = process.env.MONGO_URI;

// function to generate an access token
function generateAccessToken(id, email) {
  // set the payload of the JWT (i.e, developers can add any data they want)
  let payload = {
    user_id: id,
    email: email,
  };

  // TODO: create the JWT
  let token = null;

  return token;
}

// middleware: a function that executes before a route function
function verifyToken(req, res, next) {
  // get the JWT from the headers
  let authHeader = req.headers["authorization"];
  let token = null;
  if (authHeader) {
    // the token will be stored as in the header as:
    // BEARER <JWT TOKEN>
    token = authHeader.split(" ")[1];
    if (token) {
      // the callback function in the third parameter will be called after
      // the token has been verified
      jwt.verify(token, process.env.TOKEN_SECRET, function (err, payload) {
        if (err) {
          console.error(err);
          return res.sendStatus(403);
        }
        // save the payload into the request
        req.user = payload;
        // call the next middleware or the route function
        next();
      });
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(403);
  }
}

// 1a. create the app
const app = express();
app.use(cors()); // enable cross origin resources sharing

// 1b. enable JSON processing (i.e allow clients to send JSON data to our server)
app.use(express.json());

// uri = connection string
async function connect(uri, dbname) {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbname);
  return db;
}

// 2. CREATE ROUTES
// All routes will be created in the `main` function
async function main() {
  // connect to the mongo database
  const db = await connect(process.env.MONGO_URI, dbname);

  app.get("/movies", async function (req, res) {
    try {
      // TODO: finish the code below to get all movies - DONE
      const movies = await db
        .collection("movies-collection")
        .find()
        .project({
          _id: 0,
          title: 1,
          releaseYear: 1,
          director: 1,
        })
        .toArray();

      res.json({ movies });
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500);
    }
  });

  app.get("/movies/:id", async function (req, res) {
    try {
      // get the id of the movie that we want to get full details off
      let id = req.params.id;

      // TODO: Write the code to find movie by its id - DONE
      const movie = await db
        .collection("movies-collection")
        .find({
          _id: new ObjectId(id),
        })
        .project({
          _id: 0,
          title: 1,
        })
        .toArray();
      console.log(movie);
      res.json(movie);

      if (!movie) {
        return res.status(404).json({
          error: "Sorry, movie not found",
        });
      }

      // return a response
      res.json({
        movie: movie,
      });
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500);
    }
  });

  app.get("/movies/search", async function (req, res) {
    try {
      // extract the search params
      let { title, genre, releaseYear, rating, cast, categories } = req.query;

      // create a filter object
      let filter = {};

      if (title) {
        filter["title"] = { $in: title };
        // TODO: if the client provided a title, add it to the filter
      }

      if (genre) {
        filter["genre.name"] = { $in: genre.name };
        // TODO: if the client provided a genre, add it to the filter
      }

      if (releaseYear) {
        // TODO: if the client provided a releaseYear, add it to the filter
      }

      if (rating) {
        // TODO: if the client provided a rating, add it to the filter
      }

      if (cast) {
        // TODO: if the client provided a cast, add it to the filter
      }

      if (categories) {
        // TODO: if the client provided categories, add it to the filter
      }

      // TODO: perform the search
      const results = await db
        .collection("movies-collection")
        .find(filter)
        .toArray();

      // send back the results
      res.json({
        results: results,
      });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  // we use app.post for HTTP METHOD POST - usually to add new data
  app.post("/movies", async function (req, res) {
    try {
      // title, genre, duration, releaseYear, rating, cast, reviews and categories
      // when we use POST, PATCH or PUT to send data to the server, the data are in req.body
      let {
        title,
        genre,
        duration,
        releaseYear,
        rating,
        cast,
        reviews,
        categories,
      } = req.body;

      // basic validation: make sure that title, genre, cast, reviews and categories
      if (!title || !genre || !cast || !reviews || !categories) {
        return res.status(400).json({
          error: "Missing fields required",
        });
      }

      // find the _id of the related genre and add it to the new movie
      let genreDoc = await db.collection("genres").findOne({
        name: genre,
      });

      if (!genreDoc) {
        return res.status(400).json({ error: "Invalid genre" });
      }

      // find all the categories that the client want to attach to the movie document
      const categoryDocuments = await db
        .collection("categories")
        .find({
          name: {
            $in: categories,
          },
        })
        .toArray();

      // TODO: create a new movie document
      let newMovieDocument = {};

      //TODO: insert the new movie document into the collection
      let result = null;

      res.status(201).json({
        message: "New movie has been created",
        movieId: result.insertedId, // insertedId is the _id of the new document
      });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  app.get("/", function (req, res) {
    res.json({
      newMessage: "Slam Dunk!",
    });
  });

  app.put("/movies/:id", async function (req, res) {
    try {
      let id = req.params.id;

      let {
        title,
        genre,
        duration,
        releaseYear,
        rating,
        cast,
        reviews,
        categories,
      } = req.body;

      // basic validation: make sure that title, genre, cast, reviews and categories
      if (!title || !genre || !cast || !reviews || !categories) {
        return res.status(400).json({
          error: "Missing fields required",
        });
      }

      // find the _id of the related genre and add it to the new movie
      let genreDoc = await db.collection("genres").findOne({
        name: genre,
      });

      if (!genreDoc) {
        return res.status(400).json({ error: "Invalid genre" });
      }

      // find all the categories that the client want to attach to the movie document
      const categoryDocuments = await db
        .collection("categories")
        .find({
          name: {
            $in: categories,
          },
        })
        .toArray();

      // TODO: create a new movie document based on the provided data
      let updatedMovieDocument = null;

      // TODO: update the movie document
      let result = null;

      // if there is no matches, means no update took place
      if (result.matchedCount == 0) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      res.status(200).json({
        message: "Movie updated",
      });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  app.delete("/movies/:id", async function (req, res) {
    try {
      let id = req.params.id;

      // TODO:  delete the movie by its id
      let results = null;

      if (results.deletedCount == 0) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      res.json({
        message: "Movie has been deleted successfully",
      });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  // route for user to sign up
  // the user must provide an email and password
  app.post("/users", async function (req, res) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "Please provide user name and password",
        });
      }

      // TODO: create the new user document
      let userDocument = {};

      // TODO: Insert the new user document into the collection
      let result = null;

      res.json({
        message: "New user account has been created",
        result,
      });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  // the client is supposed to provide the email and password in req.body
  app.post("/login", async function (req, res) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Please provide email and password",
        });
      }

      // TODO: find the user by their email
      let user = null;

      // if the user exists
      if (user) {
        // check the password (compare plaintext with the hashed one in the database)
        if (bcrypt.compareSync(password, user.password)) {
          // TODO: create the accessToken
          const accessToken = null;

          res.json({
            accessToken: accessToken,
          });
        } else {
          res.status(401);
        }
      } else {
        res.status(401);
      }
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  });

  app.get("/profile", verifyToken, async function (req, res) {
    // get the payload
    let user = req.user;

    res.json({
      user,
    });
  });
}
main();

// 3. START SERVER (Don't put any routes after this line)
app.listen(3000, function () {
  console.log("Server has started");
});
