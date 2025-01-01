const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User created successfully" });
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async (req, res) => {
  try {
    const fetchBooks = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };

    const bookList = await fetchBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Task 10 (Promise Callback): Get the book list available in the shop
public_users.get('/promises', (req, res) => {
  const fetchBooks = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("Failed to fetch books"));
        }
      }, 1000);
    });
  };

  fetchBooks()
    .then((bookList) => {
      res.status(200).json(bookList);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const fetchBookByISBN = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 1000);
      });
    };

    const book = await fetchBookByISBN();
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Task 11 (Promise Callback): Get book details based on ISBN
public_users.get('/promises/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const fetchBookByISBN = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
  };

  fetchBookByISBN()
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

// Task 12: Get book details based on Author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const fetchBooksByAuthor = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter((book) => book.author === author);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("No books found for the given author"));
          }
        }, 1000);
      });
    };

    const booksByAuthor = await fetchBooksByAuthor();
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Task 12 (Promise Callback): Get book details based on Author
public_users.get('/promises/author/:author', (req, res) => {
  const author = req.params.author;

  const fetchBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter((book) => book.author === author);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for the given author"));
        }
      }, 1000);
    });
  };

  fetchBooksByAuthor()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

// Task 13: Get book details based on Title using async-await with Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const fetchBooksByTitle = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter((book) => book.title === title);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("No books found for the given title"));
          }
        }, 1000);
      });
    };

    const booksByTitle = await fetchBooksByTitle();
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Task 13 (Promise Callback): Get book details based on Title
public_users.get('/promises/title/:title', (req, res) => {
  const title = req.params.title;

  const fetchBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter((book) => book.title === title);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("No books found for the given title"));
        }
      }, 1000);
    });
  };

  fetchBooksByTitle()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
});

module.exports.general = public_users;
