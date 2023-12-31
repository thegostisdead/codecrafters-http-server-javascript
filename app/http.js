const MethodEnum = {"GET":1, "POST":2, "DELETE":3, "PUT":4, "PATCH":5, "HEAD":6, "OPTIONS":7, "CONNECT":8, "TRACE":9}

const VersionEnum = {"HTTP/1.0":1, "HTTP/1.1":2, "HTTP/2.0":3}

const StatusCodeEnum = {"OK": 200, "CREATED": 201, "ACCEPTED": 202, "NO_CONTENT": 204, "MOVED_PERMANENTLY": 301, "FOUND": 302, "SEE_OTHER": 303, "NOT_MODIFIED": 304, "TEMPORARY_REDIRECT": 307, "PERMANENT_REDIRECT": 308, "BAD_REQUEST": 400, "UNAUTHORIZED": 401, "FORBIDDEN": 403, "NOT_FOUND": 404, "METHOD_NOT_ALLOWED": 405, "NOT_ACCEPTABLE": 406, "CONFLICT": 409, "GONE": 410, "LENGTH_REQUIRED": 411, "PRECONDITION_FAILED": 412, "PAYLOAD_TOO_LARGE": 413, "URI_TOO_LONG": 414, "UNSUPPORTED_MEDIA_TYPE": 415, "RANGE_NOT_SATISFIABLE": 416, "EXPECTATION_FAILED": 417, "IM_A_TEAPOT": 418, "INTERNAL_SERVER_ERROR": 500, "NOT_IMPLEMENTED": 501, "BAD_GATEWAY": 502, "SERVICE_UNAVAILABLE": 503, "GATEWAY_TIMEOUT": 504, "HTTP_VERSION_NOT_SUPPORTED": 505}



module.exports = { MethodEnum, VersionEnum, StatusCodeEnum };
