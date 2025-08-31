import express from "express";
import cors from "cors";
import {NOT_FOUND} from "./utils/http_status_code.js";
import router from "./routes/index.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api" , router);


app.use((req, res) => {
    res.status(NOT_FOUND).json({ message: "Not Found" });
});

app.use(globalErrorHandler);

export default app;
