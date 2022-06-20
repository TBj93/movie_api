
//impoorting express
const express = require('express');

//importing bodyperser
const bodyParser = require('body-parser');

//importing morgan
const morgan = require('morgan');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var path = require("path"); //require path module
//passing morgan middle to invoke logging with morgan
app.use(morgan('common'));

//sets static website for public folder
app.use('/documentation', express.static('public'));
__dirname = path.resolve(path.dirname(''));

//array of my top movies
let topMovies = [
{title:'Fight club'},
{title:'Lord of the rings '},
{title:'Mad max '},
{title:'Matrix '},
{title:'The Machinist '},
{title:'Collateral '},
{title:'Oceans 11 '},
{title:'Oceans 12'},
{title:'The bourne identity '},
{title:'Oldboy '}
];


//all endpoints

app.get('/', (req, res) => {
  res.send('These are my top movies')
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/topmovies', (req, res) => {
  res.json(topMovies)
});

app.get('/movies', (req, res) => {
   res.send('Successful GET request returning data on ALL movies');
 });

 app.get('/movies/data/title', (req, res) => {
    res.send('Successful GET request returning all movie titles');
  });

  app.get('/movies/data/genre', (req, res) => {
     res.send('Successful GET request returning all movie genres');
   });
   app.get('/user', (req, res) => {
      res.send('Successful GET request returning data on ALL users');
    });
    app.post('/user/register', (req, res) => {
       res.send('Successful POST request adding new user by ID');
     });
   app.delete('/user/register/deregister', (req, res) => {
      res.send('Successful DELETE request deregister by user ID');
    });

     app.put('/user/info/update', (req, res) => {
        res.send('Successful PUT request updating data for user info');
      });

      app.delete('/user/movie/remove', (req, res) => {
         res.send('Successful DELETE request removing movie from user');
       });

       app.post('/user/movie/add', (req, res) => {
          res.send('Successful POST request adding movie from user');
        });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () =>{
  console.log('test');
});
