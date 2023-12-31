const net = require("net");

const { Request, parseRawRequest } = require("./request");
const { Response, NotFoundResponse} = require("./response");
const { Router } = require("./router");

const directory = process.argv[2];
const directoryPath = process.argv[3];

const router = new Router()

router.addRoute("GET", "/", "HomeController@index")
router.addRoute("GET", "/echo/*", "EchoController@index")
router.addRoute("GET", "/user-agent", "UserAgentController@index")
router.addRoute("GET", "/files/*", "FileController@name")

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
            socket.write(res.toString());
        } else if (controller === "EchoController@index") {

            const stringToEcho = req.path.replace("/echo/", "");

            const res = new Response();
            res.setVersion("HTTP/1.1");
            res.setStatusCode(200);
            res.setStatusMessage("OK");
            res.setHeader("Content-Type", "text/plain")
            res.setContentLength(stringToEcho.length);
            res.setBody(stringToEcho);
            socket.write(res.toString());
        } else if (controller === "UserAgentController@index") {
            const res = new Response();
            res.setVersion("HTTP/1.1");
            res.setStatusCode(200);
            res.setStatusMessage("OK");
            res.setHeader("Content-Type", "text/plain")
            res.setContentLength(req.headers["User-Agent"].length);
            res.setBody(req.headers["User-Agent"]);
            console.log(res.toString());
            socket.write(res.toString());
        } else if (controller === "FileController@name") {
            const fileName = req.path.replace("/files/", "");
            const fs = require("fs");
            const path = require("path");
            const filePath = path.join(directoryPath, fileName);
            console.log(filePath);

            try {
                const file = fs.readFileSync(filePath);
                const res = new Response();
                res.setVersion("HTTP/1.1");
                res.setStatusCode(200);
                res.setStatusMessage("OK");
                res.setHeader("Content-Type", "application/octet-stream")


                res.setContentLength(file.length);
                res.setBody(file.toString());
                console.log(res.toString());
                socket.write(res.toString());
            } catch (err) {
                console.log(err);
                socket.write(new NotFoundResponse().toString());
            }
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

console.log("Starting server on http://localhost:4221");
console.log("-------------------------------")
router.showRoutes();
console.log("-------------------------------")
console.log("Serving files from " + directoryPath);
console.log("-------------------------------")

server.listen(4221, "localhost");
