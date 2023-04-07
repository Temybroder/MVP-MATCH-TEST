/**
 * 
 * @param Route Authorization Permission Functions for different role types
 * 
 */

 const ApiError = require('../middlewares/errorManager/apiErrors')

// User Types Declaration
const buyer = ['Superadmin', 'admin', 'buyer'];
const seller = ['Superadmin', 'admin', 'seller'];
const admin = ['Superadmin', 'admin'];
const superAdmin = 'Superadmin';

// Grant Route Access for Single Buyer Type 
const authBuyer = () => {
    return (req, res, next) => {
        const userRole = req.session.passport.user.role;
        if(buyer.includes(userRole)){
            next();
        } else {
           next(ApiError.unauthorizedError('Unauthorized: You lack sufficient priviledges to access this Resource'));
           return;
        }
    }
}

// Grant Route Access for Single Seller Type 
const authSeller = () => {
    return (req, res, next) => {
        const userRole = req.session.passport.user.role;
        if(seller.includes(userRole)){
            next();
        } else {
            next(ApiError.unauthorizedError('Unauthorized: You lack sufficient priviledges to access this Resource'));
            return;
         }
    }
}

// Grant Route Access for Admin User Type 
const authAdmin = () => {
    return (req, res, next) => {
        const userRole = req.session.passport.user.role;
        if(admin.includes(userRole)){
            next();
        } else {
            next(ApiError.unauthorizedError('Unauthorized: You lack sufficient priviledges to access this Resource'));
            return;
         }
    }
}

// Grant Route Access for Super Admin User Type 
const authSuperadmin = () => {
    return (req, res, next) => {
        const userRole = req.session.passport.user.role;
        if(superAdmin == userRole){
            next();
        } else {
            next(ApiError.unauthorizedError('Unauthorized: You lack sufficient priviledges to access this Resource'));
            return;
         }
    }
}
const authFunctions = { authBuyer, authSeller, authAdmin, authSuperadmin };

module.exports = authFunctions;