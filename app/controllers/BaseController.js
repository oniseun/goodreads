const AppResponse = require('./../models/AppResponse');

module.exports = class BaseController {

    constructor(server) {
        this.server = server;
    }

    init() {
        //Add routes here in controllers
    }

    getServer() {
        return this.server;
    }

    sendResponse(code, message, errors)
    {
        if (errors) {
            return (new AppResponse(code, message)).setErrors(errors);
        } else {
            return new AppResponse(code, message);
        }
    }

    returnResponseWithError(res, wtiResponse, key, next, code) {
        let _message =  (wtiResponse.status == '404') ? `key ${key} not found` : wtiResponse.data;
        res.status(wtiResponse.status).json(this.sendResponse(code, _message));
    }

    returnResponse(res, data, next, code) {
        let _httpCode =  (data.id) ? 200 : 404;
        res.status(_httpCode).json(this.sendResponse(code, data));
    }
}