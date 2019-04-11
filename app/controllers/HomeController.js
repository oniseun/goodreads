const BaseController = require('./BaseController');

module.exports = class HomeController extends BaseController {

    constructor(server) {
        super(server);
    }
    /**
     * Register Controller
     */
    init() {
        this.server.get('/', this.homeAction);
        this.server.get('/api/v1', this.homeAction);
        
        this.server.use((req, res, next) => {
            res.status(404).send(super.sendResponse('NOT_FOUND', 'Resource not found'));
        });
        this.server.use((err, req, res, next) => {
            res.status(500).send(super.sendResponse('UNKNOWN_ERROR', err.message));
        });
    }

    /**
     * @api {get} / Health Check
     * @apiName Index
     * @apiGroup Health Check
     * @ApiDescription Root request to check if service is responding
     * @apiUse HealthResponse100
    */
    /**
     * @api {get} /api/v1/ Health Check v1
     * @apiVersion 1.0.0
     * @apiName Index V1
     * @apiGroup Health Check
     * @ApiDescription V1 Request to check if service is responding
     * @apiUse HealthResponse100
     */
    /**
     * Say Hello
     * @param {Object} req 
     * @param {Object} res 
     * @param {function} next 
     */
    homeAction(req, res, next) {
        res.sendFile('/public/index.html',{ root: '.'});
        
    }
}