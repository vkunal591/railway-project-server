import cors from "cors";
import multer from "multer";
import express from "express";
import env from "#configs/env";
import router from "#routes/index";
import connectDb from "#configs/database";
import sessionMiddleware from "#middlewares/session";
import globalErrorHandler from "#utils/error";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "#middlewares/bodyParser";

const __filename = fileURLToPath(import.meta.url); // Get the file path
const __dirname = path.dirname(__filename); // Get the directory path

const server = express();

await connectDb(env.DB_URI);

server.use(cors());
server.use(multer().any());
server.use(express.json());
server.use(bodyParser);
server.use(sessionMiddleware);
server.use("/api", router);
server.use("/uploads", express.static(path.join(__dirname, "../uploads")));
server.use(globalErrorHandler);

export default server;
