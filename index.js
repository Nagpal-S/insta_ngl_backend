const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const compatibilityRoutes = require("./routes/compatibilityRoutes");
const anonymousRoutes = require("./routes/anonymousRoutes");
const swipeGameRoutes = require("./routes/swipeGameRoutes");
const truthnDareRoutes = require("./routes/truthnDareRoutes");
const swaggerSetup = require("./config/swagger");
const path = require("path");
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// -------------------- Middleware --------------------
app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/compatibility", compatibilityRoutes);
app.use("/api/anonymous", anonymousRoutes);
app.use("/api/swipe-game", swipeGameRoutes);
app.use("/api/truth-n-dare", truthnDareRoutes);
swaggerSetup(app);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- Initialize Socket.IO --------------------

// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
// });

// require("./controllers/socketController")(io); 

// initializeSocket(server); // Pass server instance to socket controller
// initializeAudioSocket(server); // Pass server instance to socket controller

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// { "username": "SN", "room": "testRoom" }