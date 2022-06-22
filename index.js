
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


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/dbmovies';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

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







var path = require("path"); //require path module
//passing morgan middle to invoke logging with morgan
app.use(morgan('common'));

//sets static website for public folder
app.use('/documentation', express.static('public'));
__dirname = path.resolve(path.dirname(''));


//all endpoints

app.get('/', (req, res) => {
  res.send('Welcome to my movie database')
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});


app.get('/movies', (req, res) => {
  // res.send('Successful GET request returning data on ALL movies');

 Movies.find()
 .then((movies) => {
  res.json(movies)
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
});


 });

 app.get('/movies/:Title', (req, res) => {
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

  app.get('/genre/:Name', (req, res) => {
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
   app.get('/director/:Name', (req, res) => {
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


   app.get('/users', (req, res) => {

    Users.find().then(users => res.json(users));
     // res.send('Successful GET request returning data on ALL users');
    });

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



    app.post('/register/:Username', (req, res) => {
      // res.send('Successful POST request adding new user by ID');
      Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

  
   app.delete('/deregister/:Username', (req, res) => {
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

     app.put('/update/:Username', (req, res) => {
       // res.send('Successful PUT request updating data for user info');

        Users.findOneAndUpdate({ Username: req.params.Username },
           {
             $set: {
            Username: req.body.Username,
            Password: req.body.Password,
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
/*
      app.get('/:Username/movies', (req, res) => {
        //res.send('Successful GET request reading movies from user');
        Users.findOne({ Username: req.params.Username.FavoriteMovies })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
      });

      */
// delete fav move by user by movie id
      app.delete('/:Username/remove/:movieid', (req, res) => {
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
       app.post('/:Username/add/:movieid', (req, res) => {
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

app.listen(8080, () =>{
  console.log('test');
});
