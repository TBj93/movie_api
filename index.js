
//impoorting express
const express = require('express');

//importing bodyperser
const bodyParser = require('body-parser');

//importing morgan
const morgan = require('morgan');
const app = express();

//importing models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

//import cors
//choose between general course (seen first option here, but not recommended or recommended version below)

/*
const cors = require('cors');
app.use(cors());
*/


//recommended cors policies
const cors = require('cors');
let allowedOrigins =  ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://my-awesome-site123.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));


//import import express validator 
const { check, validationResult } = require('express-validator');

//Set up default mongoose connection /either hosted or local)

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/*
var mongoDB = 'mongodb+srv://tim7:geilgeil7@cluster0.gbesj.mongodb.net/myFlixDB?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
*/
/*
var mongoDB = 'mongodb://127.0.0.1/dbmovies';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
*/
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import auth.js
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


var path = require("path"); //require path module
//passing morgan middle to invoke logging with morgan
app.use(morgan('common'));

//sets static website for public folder
app.use('/documentation', express.static('public'));
__dirname = path.resolve(path.dirname(''));


//test

//all endpoints

app.get('/', (req, res) => {
  res.send('Welcome to my movie database')
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});


app.get('/movies',  passport.authenticate('jwt', {session:false}),  (req, res) => {
  // res.send('Successful GET request returning data on ALL movies');

 Movies.find()
 .then((movies) => {
  res.status(201).json(movies);
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
});


 });

 app.get('/movies/:Title', passport.authenticate('jwt', {session:false}), (req, res) => {
   // res.send('Successful GET request returning all movie titles');
   Movies.findOne({ Title: req.params.Title })
   .then((title) => {
     res.json(title);
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
  });

  app.get('/genre/:Name',  passport.authenticate('jwt', {session:false}),   (req, res) => {
    // res.send('Successful GET request returning all movie genres');

     Genres.findOne({ Name: req.params.Name })
     .then((genre) => {
       res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
   });
   app.get('/director/:Name',  passport.authenticate('jwt', {session:false}),  (req, res) => {
    // res.send('Successful GET request returning all movie genres');

     Directors.findOne({ Name: req.params.Name })
     .then((director) => {
       res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
   });


/*
   app.get('/director', (req, res) => {

    Directors.find().then(users => res.json(users));
     // res.send('Successful GET request returning data on ALL users');
    });

   app.get('/users', (req, res) => {

    Users.find().then(users => res.json(users));
     // res.send('Successful GET request returning data on ALL users');
    });

*/



// Get a user by username
app.get('/users/:Username',  passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



    app.post('/register', 
    
    //validate if email, pw, username is valid
    [
      check('Username', 'Username is required').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      //hash the request password
      let hashedPassword = Users.hashPassword(req.body.Password);
      
      check('Password', 'Password contains non-alphanumeric characters - not allowed.').is
      Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

  
   app.delete('/deregister/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
    //  res.send('Successful DELETE request deregister by user ID');

    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });

    });

     app.put('/update/:Username',
     //validate data
     [
      check('Username', 'Username is required').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail()
    ],

     passport.authenticate('jwt', {session:false}), (req, res) => {

      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

       // hashing updated password
       let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOneAndUpdate({ Username: req.params.Username },
           {
             $set: {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          }
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
          if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
        });
      });

// delete fav move by user by movie id
      app.delete('/:Username/remove/:movieid', passport.authenticate('jwt', {session:false}), (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.Username }, {
          $pull: { FavoriteMovies: req.params.movieid }
        },
        { new: true }, // This line makes sure that the updated document is returned
       (err, updatedUser) => {
         if (err) {
           console.error(err);
           res.status(500).send('Error: ' + err);
         } else {
           res.json(updatedUser);
         }
       });
     });

       
       //add fav movies to user by movie id
       app.post('/:Username/add/:movieid',

      
       passport.authenticate('jwt', {session:false}), (req, res) => {

    
        Users.findOneAndUpdate({ Username: req.params.Username }, {
           $push: { FavoriteMovies: req.params.movieid }
         },
         { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
        });
      });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

/*
app.listen(8080, () =>{
  console.log('test');
});
*/