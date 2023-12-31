const net = require("net");

const { Request, parseRawRequest } = require("./request");
const { Response, NotFoundResponse} = require("./response");
const { Router } = require("./router");


const router = new Router()

router.addRoute("GET", "/", "HomeController@index")
router.addRoute("GET", "/echo/*", "EchoController@index")

const server = net.createServer((socket) => {

  socket.on("data", (data) => {

    const request = data.toString();
    const req = parseRawRequest(request);

    console.log("Data received")
    console.log(request);
    console.log("-------------------------------")
    console.log(req.method);
    console.log(req.path);
    console.log(req.version);
    console.log(req.headers);
    console.log(req.body);
    console.log("-------------------------------")
    const controller = router.handleRequest(req);
    console.log(controller)
    console.log("-------------------------------")
    if (controller) {

        if (controller === "HomeController@index") {
            const res = new Response();
            res.setVersion("HTTP/1.1");
            res.setStatusCode(200);
            res.setStatusMessage("OK");
            res.setBody("Hello World");
            console.log(res.toString());
            socket.write(res.toString());
        } else if (controller === "EchoController@index") {

            const stringToEcho = req.path.replace("/echo/", "");

            const res = new Response();
            res.setVersion("HTTP/1.1");
            res.setStatusCode(200);
            res.setStatusMessage("OK");
            res.setBody(stringToEcho);
            console.log(res.toString());
            socket.write(res.toString());
        }


    } else {
        socket.write(new NotFoundResponse().toString());
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
