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
import serverless from "serverless-http"; // ✅ NEW

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Simple route
server.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

// ✅ EXPORT serverless handler for Vercel
export const handler = serverless(server);
