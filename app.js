import express from "express";
import cors from "cors";
import {NOT_FOUND} from "./utils/http_status_code.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res) => {
    res.status(NOT_FOUND).json({ message: "Not Found" });
});

export default app;
