// To prevent any form of exposure of server details in Server error trace
const ApiError = require('./apiErrors')

const apiErrorHandler = (err, req, res, next) => {
    if(err instanceof ApiError){
        res.status(err.code)
        .json({message: err.message})
        return;
    }
    res.status(500)
    .json({message: 'Something went wrong, We are working to fix it'})
}

module.exports = apiErrorHandler;