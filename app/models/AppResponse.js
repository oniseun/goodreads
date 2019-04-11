module.exports = class AppResponse {
    /**
     * @param {ResponseCode} code 
     * @param {Object} response 
     */
    constructor(code, response) {
        this.code = code;
        this.response = response;
    }

    /**
     * 
     * @param {Object []} errors } 
     */
    setErrors(errors) {
        this.errors = errors;
        return this;
    }
} 
