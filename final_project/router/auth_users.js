const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a username is valid
const isValid = (username) => {
  // Check if the username is a non-empty string
  if (username && typeof username === "string" && username.trim().length > 0) {
    return true;
  }
  return false;
};

// Check if a user is authenticated (username and password match)
const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Save the token in the session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Validate if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Validate if the user is logged in
  const username = req.session.authorization?.accessToken
    ? jwt.verify(req.session.authorization.accessToken, "access").username
    : null;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized: Please log in" });
  }

  // Validate the review content
  if (!review || typeof review !== "string" || review.trim().length === 0) {
    return res.status(400).json({ message: "Invalid review content" });
  }

  // Add or modify the review for the given book and user
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Validate if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Validate if the user is logged in
  const username = req.session.authorization?.accessToken
    ? jwt.verify(req.session.authorization.accessToken, "access").username
    : null;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized: Please log in" });
  }

  // Check if the user's review exists
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    // Delete the user's review
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
