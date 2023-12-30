const net = require("net");

const server = net.createServer((socket) => {

  socket.on("data", (data) => {
    console.log("Data received")
    console.log(data.toString());
    socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
    socket.end();
    server.close();
  });

  socket.on("error", (err) => {
    console.log(err);
    socket.end();
  });


  socket.on("close", () => {
    console.log("Connection closed");
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
