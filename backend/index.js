import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://virtual-assistance-9ypu.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
