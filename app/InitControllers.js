module.exports = class InitControllers {
    /**
     * Register all Controllers to the server Object
     * @param {Object} server 
     */
    init(server) {
        var controllerPath = require("path").join(__dirname, "/controllers");
        var _HomepageController;

        require("fs").readdirSync(controllerPath).forEach(function(file) {
            if ("BaseController.js" !== file && "HomeController.js" !== file) {
                let Controller = require("./controllers/" + file);
                (new Controller(server)).init();
            } else if ("HomeController.js" === file) {
                _HomepageController = require("./controllers/" + file);
            }
        });

        if (_HomepageController) {
            (new _HomepageController(server)).init();
        }
        
        return server;
    }
}