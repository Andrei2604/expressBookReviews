const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user_with_same_name = users.filter((user) => {
       return user.username == username
    });
    return user_with_same_name.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const validusers = users.filter((user) => {
       return user.username == username && user.password == password
    });
    
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    if(authenticatedUser(username, password)){
        let token = jwt.sign({
            data: password
        },"access", {expiresIn: 60 * 60});

        req.session.authorization = {token, username};
        
        res.status(200).json({message: "User successfully logged in"});
    }
    else{
        res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  }
  else{
    res.status(404).json({ message: "Error logging in" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
