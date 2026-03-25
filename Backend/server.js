import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";

import userRouter from "./routes/userRoute.js"
import authRouter from "./routes/taskRoute.js";


dotenv.config();
const app =express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const port =process.env.PORT ||8000;

//middelware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//DB CONNECT
connectDB();

//Route
app.use("/api/user",userRouter);
app.use("/api/task",authRouter);

app.get("/",(req,res)=>{
    res.send('API Working');
})

// Presence tracking
const presence = {}; // { taskId: [ { userId, name, avatar } ] }

// Socket Auth Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Should ideally also have name/avatar if in token
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

// Socket connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id, "User ID:", socket.user?.id);

    socket.on("task:viewing", ({ taskId, user }) => {
        if (!presence[taskId]) presence[taskId] = [];
        // Add if not already there
        if (!presence[taskId].find(u => u.id === user.id)) {
            presence[taskId].push(user);
        }
        io.emit("presence:update", { taskId, viewers: presence[taskId] });
    });

    socket.on("task:stopped-viewing", ({ taskId, userId }) => {
        if (presence[taskId]) {
            presence[taskId] = presence[taskId].filter(u => u.id !== userId);
            io.emit("presence:update", { taskId, viewers: presence[taskId] });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Clean up presence on disconnect
        Object.keys(presence).forEach(taskId => {
            presence[taskId] = presence[taskId].filter(u => u.socketId !== socket.id); // Need to track socketId too or just use userId
            // For simplicity in this demo, we might just use userId from socket.user
            presence[taskId] = presence[taskId].filter(u => u.id !== socket.user?.id);
            io.emit("presence:update", { taskId, viewers: presence[taskId] });
        });
    });
});

// Export io to use in controllers
app.set("io", io);

httpServer.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
});

