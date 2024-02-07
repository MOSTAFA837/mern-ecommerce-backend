import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req, res) => res.send("hello server"));

const port = process.env.PORT;

app.listen(port, () => console.log(`server is running on port ${port}`));
