import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


//Router Imports:
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


//Routes:
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);


export default app;