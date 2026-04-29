"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgClient = new pg_1.Client("postgresql://neondb_owner:npg_WmRU0L2GYPBi@ep-late-sun-a4i41o5p-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
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
    }
    catch (error) {
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
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map