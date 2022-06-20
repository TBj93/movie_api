//importing mongoose
const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
movieid: {type: Number, required: true},
Title: {type: String, required: true},
Description: {type: String, required: true},
Genre: [{  type: mongoose.SchemaTypes.ObjectId, ref: 'Genre' }],
Director: [{  type: mongoose.SchemaTypes.ObjectId, ref: 'Director' }],
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



let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


module.exports.Movie = Movie;
module.exports.User = User;