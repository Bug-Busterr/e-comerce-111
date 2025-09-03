import app from "./app.js";
import dotenv from "dotenv";
import { connectToDataBase, disconnectFromDataBase } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
let server;

async function connectToDataBaseThenStartServer() {
    try {
        console.log('Attempting to connect to database...');
        await connectToDataBase();
        
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err);
        });

    } catch (err) {
        console.error("Cannot connect to DataBase:", err.message);
        process.exit(1);
    }
}

async function disconnectFromDataBaseThenCloseServer() {
    console.log('Shutting down gracefully...');
    try {
        if (server) {
            server.close(async () => {
                try {
                    await disconnectFromDataBase();
                    console.log("Server closed, DB disconnected");
                    process.exit(0);
                } catch (err) {
                    console.error("Error during shutdown:", err);
                    process.exit(1);
                }
            });
        } else {
            await disconnectFromDataBase();
            process.exit(0);
        }
    } catch (err) {
        console.error("Cannot disconnect DataBase:", err);
        process.exit(1);
    }
}

// Handle different shutdown signals
process.on("SIGINT", disconnectFromDataBaseThenCloseServer);
process.on("SIGTERM", disconnectFromDataBaseThenCloseServer);
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

await connectToDataBaseThenStartServer();
