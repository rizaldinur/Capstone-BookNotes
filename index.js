import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { itemsPool } from "./DBConfig.js";

const app = express();
const port = 5070;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("favicon"));
app.use(express.static("src"));

async function getItemsData() {
  try {
    const res = await itemsPool.query(
      "SELECT * FROM reviewed_books ORDER BY id ASC"
    );
    // console.log(res.rows);
    if (res.rows.length) {
      return res.rows;
    }
    return [];
  } catch (error) {
    console.error("Error fetching items data from database.\n", error.stack);
    return [];
  }
}

async function bookReviewed(bookKey) {
  try {
    const res = await itemsPool.query(
      `SELECT *FROM reviewed_books WHERE key = '${bookKey}' ORDER BY id ASC`
    );
    if (res.rows.length) {
      return res.rows;
    }
    return [];
  } catch (error) {
    console.error("Error fetching items data from database.\n", error.stack);
    return [];
  }
}

async function editReview(review) {
  try {
    await itemsPool.query(
      "UPDATE reviewed_books SET review = $1, rating = $2 WHERE key = $3",
      [review.reviewArea, review.rating, review.bookKey]
    );
  } catch (err) {
    console.warn(err.stack);
  }
}

async function newReview(review) {
  try {
    await itemsPool.query(
      "INSERT INTO reviewed_books (key, book_title, author, date_publish, review, cover,rating) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [
        review.bookKey,
        review.title,
        review.author,
        review.date_publish,
        review.reviewArea,
        review.cover,
        review.rating,
      ]
    );
  } catch (err) {
    console.warn(err.stack);
  }
}

async function deleteReview(bookKey) {
  try {
    await itemsPool.query("DELETE FROM reviewed_books WHERE key = $1", [
      bookKey,
    ]);
  } catch (err) {
    console.warn(err.stack);
  }
}
// GET home page
app.get("/", async (req, res) => {
  const items = await getItemsData();

  res.render("index.ejs", {
    books: items,
  });
});

app.get("/search-book", async (req, res) => {
  const query = req.query;
  if (!query.hasOwnProperty("perpage")) {
    query.perpage = 20;
  } else {
    query.perpage = parseInt(query.perpage);
  }
  console.log(query);
  const result = await axios.get(
    `https://openlibrary.org/search.json?q=${query.search}&limit=200&fields=key,title,author_name,cover_i,first_publish_year`
  );
  // console.log(result.data.docs);
  // res.sendStatus(200);

  const data = result.data.docs;
  // let author = [];

  data.forEach((book) => {
    try {
      book.author_name = book.author_name.toString();
    } catch (error) {
      book.author_name = "";
      console.error(error);
    }
    // console.log(book.author_name);
  });

  res.render("searchResults.ejs", {
    books: data,
    query: query,
  });
});

// GET a reviewed book
app.get("/book", async (req, res) => {
  const bookKey = req.query.bookKey;
  const book = await bookReviewed(bookKey);
  // console.log(book[0]);
  // console.log(bookKey);

  //check if book already reviewd in DB
  //if exist
  if (book.length) {
    return res.render("book.ejs", {
      book: book[0],
    });
  } else {
    const result = await axios.get(
      `https://openlibrary.org/search.json?q=${bookKey}&limit=1&fields=key,title,author_name,cover_i,first_publish_year`
    );
    const bookData = result.data.docs[0];
    const imgURL = `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg`;

    const book = {
      key: bookData.key.replace("/works/", ""),
      author: bookData.author_name.toString(),
      cover: imgURL,
      book_title: bookData.title,
      date_publish: bookData.first_publish_year.toString(),
      review: "",
      rating: 0,
    };
    console.log(book);
    // return res.sendStatus(200);
    return res.render("review.ejs", {
      book: book,
    });
  }
});

app.post("/edit-review", async (req, res) => {
  const bookKey = req.body.bookKey;
  const book = await bookReviewed(bookKey);
  // console.log(bookKey);
  // console.log(book[0]);
  res.render("review.ejs", { book: book[0] });
});

app.post("/submit-review", async (req, res) => {
  const review = req.body;
  // console.log(review);
  if ((await bookReviewed(review.bookKey)).length) {
    try {
      await editReview(review);
      res.redirect(`/book?bookKey=${review.bookKey}`);
    } catch (error) {
      console.error(error);
      res.sendStatus(400);
    }
  } else {
    try {
      await newReview(review);
      res.redirect(`/book?bookKey=${review.bookKey}`);
    } catch (error) {
      console.error(error);
      res.sendStatus(400);
    }
  }
});

app.post("/delete", async (req, res) => {
  const bookKey = req.body.bookKey;
  console.log(bookKey);
  await deleteReview(bookKey);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Process PID: ${process.pid}`);
  console.log(`Process PPID: ${process.ppid}`);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  itemsPool.end(() => {
    console.log("Pool has ended");
    process.exit(0);
  });
});
