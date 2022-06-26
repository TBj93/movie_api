//importing mongoose
const mongoose = require('mongoose');

//importing bcrypt for hashing
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
movieid: {type: Number, required: true},
Title: {type: String, required: true},
Description: {type: String, required: true},
Genre: {type: Number, required: true},
Director: {type: Number, required: true},
ImagePath: String,
Featured: Boolean

})
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };


let genreSchema = mongoose.Schema({
  genreid: {type: Number, required: true},
  Name: {type: String, required: true},
  Description: {type: String, required: true}
});
let directorSchema = mongoose.Schema({
  directorid: {type: Number, required: true},
  Name: {type: String, required: true},
  Bio: {type: String, required: true},
    Birthday: Date,
    Death: Date
});



let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;