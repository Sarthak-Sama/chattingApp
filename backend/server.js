const express = require("express");
const path = require("path");
const app = express();
const indexRouter = require("./routes/index.routes");
const http = require("http");

const server = http.createServer(app);
const socketIO = require("socket.io");
const { connect } = require("http2");
const io = socketIO(server);

let waitingUsers = [];
let rooms = {};


io.on("connection", (socket) => {
  socket.on("joinroom", ()=>{
    if(waitingUsers.length > 0){
      let partner = waitingUsers.shift();
      const roomname = `${socket.id}-${partner.id}`;
      // Joining the room
      socket.join(roomname);
      partner.join(roomname);

      io.to(roomname).emit("joined", roomname);

    } else{
      waitingUsers.push(socket);
    }
  })


  socket.on("message", (data)=>{
    socket.broadcast.to(data.room).emit("message", data.message)
  })

  socket.on("startVideoCall", ({room})=>{
    socket.broadcast.to(room).emit("incomingCall")
  })

  socket.on("acceptCall", ({room})=>{
    socket.broadcast.to(room).emit("callAccepted");
  })

  socket.on("rejectCall", ({room})=>{
    socket.broadcast.to(room).emit("callRejected");
  })

  socket.on("signalingMessage", (data)=>{
    socket.broadcast.to(data.room).emit("signalingMessage", data.message);
  })
  
  


  socket.on("disconnect", ()=>{
    let index = waitingUsers.findIndex(waitingUser => waitingUser.id === socket.id);
    waitingUsers.splice(index, 1);
  })


})

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
