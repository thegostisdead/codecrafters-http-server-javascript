class Response {

    constructor() {
        this.version = "";
        this.statusCode = 200;
        this.statusMessage = "";
        this.headers = {};
        this.body = "";
    }

    setVersion(version) {
        this.version = version;
    }

    setStatusCode(statusCode) {
        this.statusCode = statusCode;
    }

    setStatusMessage(statusMessage) {
        this.statusMessage = statusMessage;
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }

    setContentLength(contentLength) {
        this.headers["Content-Length"] = contentLength;
    }

    setBody(body) {
        this.body = body;
    }

    toString() {
        let response = `${this.version} ${this.statusCode} ${this.statusMessage}\r\n`;
        for (const [key, value] of Object.entries(this.headers)) {
            response += `${key}: ${value}\r\n`;
        }
        response += `\r\n${this.body}`;
        return response;
    }
}

class NotFoundResponse extends Response {

        constructor() {
            super();
            this.setVersion("HTTP/1.1");
            this.setStatusCode(404);
            this.setStatusMessage("Not Found");
            this.setBody("Not Found");
        }
}

module.exports = { Response, NotFoundResponse };
