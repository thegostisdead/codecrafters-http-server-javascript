

class Router {

    constructor() {
        this.routes = [];
    }

    addRoute(method, path, handler) {
        this.routes.push({ method, path, handler });
    }

    handleRequest(req) {
        for (const route of this.routes) {
            if (req.method === route.method && req.path === route.path) {
                return route.handler;
            }
        }
        return null;
    }

}

module.exports = { Router };
