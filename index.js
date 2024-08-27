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

let items = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("node_modules"));

async function getItemsData() {
  try {
    const res = await db.query("SELECT * FROM reviewed_books ORDER BY id ASC");
    console.log(res.rows);
    return res.rows;
  } catch (error) {
    console.error("Error fetching items data from database.\n", error.stack);
    return [];
  }
}

// GET home page
app.get("/", async (req, res) => {});

// POST a new post
app.post("/submit", (req, res) => {});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
