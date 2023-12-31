

class Router {

    constructor() {
        this.routes = [];
    }

    addRoute(method, path, controller) {
        this.routes.push({ method, path, controller });
    }

    handleRequest(req) {

        // /echo/* -> /echo/1234
        // /echo/1234 -> /echo/1234
        // /echo/ -> /echo/
        // /echo -> /echo

        for (const route of this.routes) {
            if (route.method === req.method) {
                if (route.path === req.path) {
                    return route.controller;
                } else if (route.path.endsWith("*")) {
                    const routePath = route.path.replace("*", "");
                    if (req.path.startsWith(routePath)) {
                        return route.controller;
                    }
                }
            }
        }
        return null;
    }

    showRoutes() {
        for (const route of this.routes) {
            console.log(`${route.method} ${route.path} -> ${route.controller}`);
        }
    }

}

module.exports = { Router };
