const net = require("net");
const fs = require("fs");
const { once } = require('events');
const path = require("path");

const {Request, parseRawRequest} = require("./request");
const {Response, NotFoundResponse} = require("./response");
const {Router} = require("./router");

const directory = process.argv[2];
const directoryPath = process.argv[3];

const router = new Router()

router.addRoute("GET", "/", "HomeController@index")
router.addRoute("GET", "/echo/*", "EchoController@index")
router.addRoute("GET", "/user-agent", "UserAgentController@index")
router.addRoute("GET", "/files/*", "FileController@name")
router.addRoute("POST", "/files/*", "FileController@aze")

const server = net.createServer((socket) => {

    socket.on("data", async (data) => {

        const request = data.toString();
        const req = parseRawRequest(request);

        console.log("Data received")
        console.log(request);
        console.log("-------------------------------")
        console.log(req.method);
        console.log(req.path);
        console.log(req.version);
        console.log(req.headers);
        console.log("-------------------------------")
        console.log(req.body);
        console.log("-------------------------------")
        const controller = router.handleRequest(req);
        console.log(controller)
        console.log("-------------------------------")

        const res = new Response();
        switch (controller) {

            case "HomeController@index":
                res.setVersion("HTTP/1.1");
                res.setStatusCode(200);
                res.setStatusMessage("OK");
                res.setBody("Hello World");
                socket.write(res.toString());
                break;
            case "EchoController@index":
                const stringToEcho = req.path.replace("/echo/", "");
                res.setVersion("HTTP/1.1");
                res.setStatusCode(200);
                res.setStatusMessage("OK");
                res.setHeader("Content-Type", "text/plain")
                res.setContentLength(stringToEcho.length);
                res.setBody(stringToEcho);
                socket.write(res.toString());
                break;
            case "UserAgentController@index":
                res.setVersion("HTTP/1.1");
                res.setStatusCode(200);
                res.setStatusMessage("OK");
                res.setHeader("Content-Type", "text/plain")
                res.setContentLength(req.headers["User-Agent"].length);
                res.setBody(req.headers["User-Agent"]);
                console.log(res.toString());
                socket.write(res.toString());
                break;
            case "FileController@name":
                const fileName = req.path.replace("/files/", "");
                console.log(path.join(directoryPath, fileName));

                const fileExists = fs.existsSync(path.join(directoryPath, fileName));

                if (!fileExists) {
                    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                } else {
                    const file = fs.readFileSync(path.join(directoryPath, fileName), {encoding: 'binary'});
                    // const res = new Response();
                    res.setVersion("HTTP/1.1");
                    res.setStatusCode(200);
                    res.setStatusMessage("OK");
                    res.setHeader("Content-Type", "application/octet-stream")
                    res.setContentLength(file.length);
                    res.setBody(file);
                    console.log(res.toString());
                    socket.write(res.toString());
                }
                break;
            case "FileController@aze":
                const toUploadFilename = req.path.replace("/files/", "");
                const uploadPath = path.join(directoryPath, toUploadFilename);


                // check if directory exists

                const directoryExists = fs.existsSync(directoryPath);

                if (!directoryExists) {
                    socket.write(new NotFoundResponse().toString());
                }

                // const chunks = [];
                // socket.on('data', (chunk) => {
                //     chunks.push(chunk);
                // });
                //
                // // Wait until all the data has been received
                // await once(socket, 'end');
                //
                // const buff = Buffer.concat(chunks);

                try {
                    fs.writeFileSync(uploadPath, req.body);
                } catch (e) {
                    console.error(e);
                }
                res.setVersion("HTTP/1.1");
                res.setStatusCode(201);
                socket.write(res.toString());
                break;
            case null:
            default:
                console.log("No controller found")
                const notFoundResponse = new NotFoundResponse();
                socket.write(notFoundResponse.toString());
                break;
        }

        socket.end();
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
