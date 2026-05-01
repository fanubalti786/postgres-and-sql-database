import { Client } from "pg";
import express from "express";

const app = express();
app.use(express.json());

const pgClient = new Client(
  "",
);

pgClient
  .connect()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("DB error:", error);
  });

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const insertQuery = `INSERT INTO users (username,email,password) VALUES ('${username}','${email}','${password}');`;
  const existingQuery = `SELECT * FROM users WHERE email='${email}' OR username='${username}'`;

  try {
    const existing = await pgClient.query(existingQuery);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Email or Username already exists",
      });
    }

    const response = await pgClient.query(insertQuery);
    console.log(response);
    res.json({
      message: "you have signed up",
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/", async (req, res) => {
  const insertQuery = `SELECT * FROM users`;
  try {
    const response = await pgClient.query(insertQuery);
    console.log(response);
    res.status(200).json({
      message: response.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("app is running on port: 3000");
});
// async function main() {
//   try {
//     const response = await pgClient.query("UPDATE users SET username='muhammad ali' WHERE id=7;");
//     console.log(response.rows);
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
