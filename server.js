import app from "./app.js";
import dotenv from "dotenv";
import { connectToDataBase, disconnectFromDataBase } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
let server;

async function connectToDataBaseThenStartServer() {
    try {
        await connectToDataBase();
        server = app.listen(PORT, () =>
            console.log(`🚀 Server is running on http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("❌ Cannot connect to DataBase", err);
    }
}

async function disconnectFromDataBaseThenCloseServer() {
    try {
        if (server) {
            server.close(async () => {
                await disconnectFromDataBase();
                console.log("🛑 Server closed, DB disconnected");
                process.exit(0);
            });
        }
    } catch (err) {
        console.error("❌ Cannot disconnect DataBase", err);
    }
}

process.on("SIGINT", disconnectFromDataBaseThenCloseServer);
process.on("SIGTERM", disconnectFromDataBaseThenCloseServer);

await connectToDataBaseThenStartServer();
