import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import router from "./routes";
import './shared/knex';


const PORT = process.env.PORT || 5000;

(() => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(morgan('common'));
    app.use("/api/v1", router)
    const server = createServer(app);
    server.listen(PORT, () => {
        console.log(`⚡ Server is running on port ${PORT} ⚡`);
    })
})();
