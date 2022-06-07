
//impoorting express
const express = require('express');
//importing morgan
const morgan = require('morgan');

const app = express();
//passing morgan middle to invoke logging with morgan
app.use(morgan('common'));

app.use('/documentation', express.static('public'));
__dirname = path.resolve(path.dirname(''));


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

app.get('/', (req, res) => {
  res.send('These are my top movies')
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});


app.get('/movies', (req, res) => {

  res.json(topMovies)
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () =>{
  console.log('test');
});
