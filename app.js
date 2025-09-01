import express from "express";
import cors from "cors";
import {NOT_FOUND} from "./utils/http_status_code.js";
import router from "./routes/index.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { corsOptions } from "./config/corsOption.js";
import helmet from "helmet";

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.use("/api" , router);


app.use((req, res) => {
    res.status(NOT_FOUND).json({ message: "Not Found" });
});

app.use(globalErrorHandler);

export default app;
