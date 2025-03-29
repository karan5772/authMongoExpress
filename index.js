import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/user.routs.js";
import client from "./utils/db.utils.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
client();

var port = process.env.PORT|| 4000;

app.use("/api/v1/users", routes);

app.listen(port,()=>{
    console.log(`Connected to ${port}`);
});
