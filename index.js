const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//server
const { Server } = require("socket.io");
const io = new Server(server);
//rotas
app.use("/public", express.static("public", {

}))
//home
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
//setup dos sockets
const users = {}

io.on('connection', (socket) => {
  console.log(`[${socket.id}] LOG:USER_CONNECTED`)
  users[socket.id] = {id: socket.id, x:0, y:0}
  socket.on('disconnect', () => {
      console.log(`[${socket.id}] LOG:USER_DISCONNECTED`)
      users[socket.id] = undefined
      
  })

  socket.on("ON_USER_MOVE", (newPosition) => {
    const user = users[socket.id];
    user.x = user.x + (newPosition.move.x || 0)
    user.y = user.y + (newPosition.move.y || 0)
    io.emit("ON_USERS_UPDATE", JSON.stringify(users))
  })

});


server.listen(3000, () => console.log('listening on *:3000'));