const net = require("net");

const { Request, parseRawRequest } = require("./request");
const { Response } = require("./response");
const { Router } = require("./router");


const router = new Router()

router.addRoute("GET", "/", "Hello World")

const server = net.createServer((socket) => {

  socket.on("data", (data) => {

    const request = data.toString();
    console.log("Data received")
    console.log(request);
    console.log("-------------------------------")

    const req = parseRawRequest(request);

    console.log(req.method);
    console.log(req.path);
    console.log(req.version);
    console.log(req.headers);
    console.log(req.body);
    console.log("-------------------------------")
    const activate = router.handleRequest(req)
    if (activate) {
        const res = new Response();
        res.setVersion("HTTP/1.1");
        res.setStatusCode(200);
        res.setStatusMessage("OK");
        res.setBody(router[req.path]);
        console.log(res.toString());
        socket.write(res.toString());
    } else {
        const res = new Response();
        res.setVersion("HTTP/1.1");
        res.setStatusCode(404);
        res.setStatusMessage("Not Found");
        res.setBody("Not Found");
        console.log(res.toString());
        socket.write(res.toString());
    }

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

console.log("Starting server on port 4221");
console.log("-------------------------------")
const routes = router.routes;
console.log(routes);
server.listen(4221, "localhost");
