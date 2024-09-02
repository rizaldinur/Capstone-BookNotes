## Welcome
This personal project of mine is a book review notes that basically save and view all the books you have read and reviewed.

The main function of my app :
- Save and view already reviewed books.
- Search for any book. If you have reviewed a book, it will automatically show your review details.
- If not, then user is prompted to blank review, which you can submit.
- You can edit or delete a reviewed book.

My app is built on:
- EJS, Bootstrap (Front-end)
- Node, ExpressJS (Backend)
- Postgre Database (Database)

## How to start this app on your machine
### 1. Create `.env` file on your project root directory
Inside, add this line as the link of your database `DBConfigLink=postgresql://<username>:<password>@localhost:5432/<database>`.
Replace `<username>`, `<password>`, and `<database>` accordingly to your database setup.
Additionally, you can also change the port `5432` to any port that your database uses.

> `DBConfigLink` is basically just a key name to the string of your postgre database. It can be named anything else.

### 2. In case you change the key name `DBConfigLink` in `.env` to something else
Make sure that inside `DBConfig.js` on line `process.env.DBConfigLink` , you change `DBConfigLink` to anything that match the key inside `.env`.
```
export const itemsPool = new pkg.Pool({
  connectionString: process.env.<yourKeyName>,
  ssl: false,
});
```

### 3. Run the app
In your terminal, write `node index.js` command and then press Enter to run the app. Then follow the link `localhost:5070` to use the app.

### That's it, you are done! Have fun using my app 😁😁😁


