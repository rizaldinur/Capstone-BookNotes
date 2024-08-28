import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// set up db connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "surabaya12",
  port: 5432,
});

db.connect();

// read data from db
// db.query("SELECT * from capitals", (err, res) => {
//   if (err) {
//     console.error("Error executing query", err.stack);
//   } else {
//     quiz = res.rows;
//   }
//   db.end();
// });

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("node_modules"));

async function getItemsData() {
  try {
    const res = await db.query("SELECT * FROM reviewed_books ORDER BY id ASC");
    console.log(res.rows);
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
    const res = await db.query(
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
    await db.query(
      "UPDATE reviewed_books SET review = $1, rating = $2 WHERE key = $3",
      [review.reviewArea, review.rating, review.bookKey]
    );
  } catch (err) {
    console.warn(err.stack);
  }
}
// GET home page
app.get("/", async (req, res) => {
  items = await getItemsData();

  res.render("index.ejs", {
    books: items,
  });
});

// POST a new post
app.get("/book", (req, res) => {
  const bookKey = req.query.bookKey;
  console.log(bookKey);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
