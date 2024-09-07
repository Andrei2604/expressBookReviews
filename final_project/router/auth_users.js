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
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  if(!username || !isbn || !review){
   return res.status(400).json({message: "Bad request"});
  }

  const reviews = books[isbn].reviews;
  
  reviews[username] = review;
  console.log(books);
  
  res.status(200).json({message:"Review updated"});
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (!username || !isbn){
        return res.status(400).json({message: "Bad request"});
    }

    delete books[isbn].reviews[username];
    console.log(books);
    res.status(200).json({message:"The review has been deleted"});
   
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
