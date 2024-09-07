const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){
        users.push({"username": username, "password": password})
        res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else{
        res.status(404).json({message: "User already exists!"});
    }
  }
  else{
    res.status(404).json({message: "Unable to register user."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  });
  promise.then((message) => {
    res.status(200).send(message);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(books[isbn]);
  })
  
  promise.then((message) => {
    res.status(200).send(message);
  });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const author = req.params.author;
    let result = [];
    Object.entries(books).forEach(([key, value]) => {
        if (value.author === author){
            result.push(value);
        }
    });
    resolve(result);
  });
  
  promise.then((message) => {
    res.status(200).send(message);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const title = req.params.title;
    let result = [];
    Object.entries(books).forEach(([key, value]) => {
      if (value.title === title){
          result.push(value);
      }
    });
    resolve(result);
  })
 
  promise.then((message) => {
    res.status(200).send(message);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    res.status(200).send(reviews);
});

module.exports.general = public_users;
