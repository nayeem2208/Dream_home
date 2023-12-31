import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errormiddleware.js";

const port = process.env.PORT || 3001;
connectDB();

const app = express();

app.use(express.static("backend/public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const corsOptions = {
  origin: ["https://www.dreamhome.cloud","https://dreamhome.cloud"],
  // methods: ['GET', 'POST','PUT'],
  credentials: true,
  // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
   // Add 'Content-Type' to the list of allowed headers
};

app.use(cors(corsOptions));

app.use("/", userRouter);
app.use("/admin", adminRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/dream_home/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dream_home","dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`server connected to ${port}`);
});

import { Server } from "socket.io";
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://www.dreamhome.cloud","https://dreamhome.cloud"],
  },
});
let onlineUsers = [];

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");
//   socket.on("setup", (userData) => {
//     socket.join(userData.id);
//     console.log("userInfooooooooo", userData.id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("user room", room);
//   });

//   socket.on("typing", (room) =>{ 
    
//     socket.in(room).emit("typing")});
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  

//   socket.on("new message", ({ newMessage, userId }) => {
//     const chat = newMessage.room

//     if (!chat ) {
//       return console.log('chat.participants not defined');
//     }
//       socket.to(userId).emit('message received', {
//         room: chat, // Use the entire chat object
//         senderId: newMessage.senderId, // Use the sender information
//         ...newMessage, // Use the rest of the message content
//       });
     
      

//   });

//   socket.off("setup", (userId) => {
//     console.log("User disconnected:", userId);
//     // Additional cleanup if needed
//   });
// });

io.on("connection", (socket) => {
  console.log('socket connected to i.o')
  socket.on("addNewUser", (userId) => {
    console.log('socket connected to ',userId)
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    const user = onlineUsers.filter((user) => user.userId === data.to);

    if (user.length > 0) {
      io.to(user[0].socketId).emit("newMessage", data.message, data.from,data.chatId,data.to);
      // io.to(user[0].socketId).emit("updateList", data.from, data.chatId);
    }
  });

  // socket.on("updateUnread", (info) => {
  //   const user = onlineUsers.filter((user) => user.userId === info._id);
  //   if (user.length > 0) {
  //     io.to(user[0].socketId).emit("notification");
  //   }
  // });
});