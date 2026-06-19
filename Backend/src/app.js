import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // access and set cookies 
const app = express()

console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN);
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" })) //configuration for url data handling
app.use(express.static("public"))//a public assets for eg images favicon
app.use(cookieParser())


import projectsRouter from './routes/projects.routes.js'
import userRouter from './routes/user.routes.js'
import { errorHandler } from "./middlewares/errorHandler.middleware.js"


app.use("/api/v1/projects", projectsRouter)
app.use("/api/v1/users", userRouter)

app.use(errorHandler)
export { app }