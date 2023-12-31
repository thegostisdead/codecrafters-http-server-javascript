const {MethodEnum} = require("./http");

class Request {

    constructor() {
        this.method = MethodEnum.GET;
        this.path = "";
        this.version = "";
        this.headers = {};
        this.body = "";
    }

    setMethod(method) {
        this.method = method;
    }

    setPath(path) {
        this.path = path;
    }

    setVersion(version) {
        this.version = version;
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    setBody(body) {
        this.body = body;
    }

}


function parseRawRequest(request) {
    const lines = request.split("\r\n"); // Split request into lines
    const firstLine = lines.shift(); // Get the first line
    const [method, path, version] = firstLine.split(" "); // Destructure the first line

    const headers = {};
    lines.forEach((line) => {
        const [key, value] = line.split(": ");
        headers[key] = value;
    });

    const body = lines[lines.length - 1];

    const req = new Request();
    req.setMethod(method);
    req.setPath(path);
    req.setVersion(version);
    req.setHeaders(headers);
    req.setBody(body);

    return req;
}


module.exports = { Request, parseRawRequest };
