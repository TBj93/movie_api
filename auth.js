/**impoorting JWT
 *  @constant
 *  @type {string}
*/

const jwtSecret = 'your_jwt_secret';  //same key from jstStrategy
const jwt = require('jsonwebtoken'),
passport = require('passport');

require('./passport'); //local file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, 
        expiresIn: '7d',
        algorithm:'HS256'
    });
}



/**post method for user to login
 * @method Post
 *  @router
 *  @type {string}
*/
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session:false}, (error, user, info) =>{
            if (error ||!user) {
               return res.status(400).json({
                message: 'Something is not right',
                user:user
               });
            }
 

req.login(user, { session: false}, (error) => {
    if(error) {
        res.send(error);
    }
    let token= generateJWTToken(user.toJSON());
    return res.json({ user, token});
});
})(req, res);
});
}