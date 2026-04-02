import express from "express";
import cors from "cors";


//Router Imports:
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routes:
app.use("/api/v1/auth", authRouter);


export default app;