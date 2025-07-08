// class ExpressError extends Error{
//     constructor(statusCode, message){
//         super();
//         this.statusCode = statusCode;
//         this.message = message;
//     }
// }
class ExpressError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error") {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;