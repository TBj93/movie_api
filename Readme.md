# Movie Api

## Description
This RESTful APi is hosted on heroku and requests data from a mongoDB database hosted on Atlas( a mongoDB cloud)
It allows many requests to perform from a client or a pseudo client ( like postman).
Doing so, the user can access different endpoints, for example:  movies, certain movie data, users, user data from the database, as well as add user details ( favorite movies, birthday, etc.) to it, update or delete it.  
The app uses Jwt authentication, as well as password hashing.

## Challenges I faced

A lot of packages and dependencies are being used there with node.js/ node_modules.
Although they really help you get the job done and take a lot of work from you, it's difficult sometimes to keep it all together, which is why documentation and comments are so useful.

## Requirements
- Access to a hosted database on Atlas (mongoDB)
- latest nvm and node version 


## Technology used

Html, Js, Node.js, 
Packages/dependencies: 

- mongoose
- uuid
- jwt
- Cors
- bcrypt
- morgan
- bodyparser
- express
- port
- passport(jwt)

## Endpoints
 
- user login / post method
- user registration / post method
- get all movies / get method
- get certain movie, genre, director / get method
- add/ remove fav movie / post/delete method
- update user / put method
- delete user  / delete method

 also refer to the [documentation](https://github.com/TBj93/movie_api/blob/master/public/documentation.html)  page for the exact links


