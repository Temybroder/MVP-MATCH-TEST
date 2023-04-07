const  express =  require("express");
const router = express.Router();

const authFunctions = require("../services/Authorization");
const { authBuyer, authSeller, authAdmin, authSuperadmin } = authFunctions;

const { createUser, getUser, updateUser, deleteUser, createProduct, getProduct, updateProduct, deleteProduct, depositFunds, buy, reset } = require("../controllers/controller");


const ApiError = require('../middlewares/errorManager');

const { checkAuthenticated, forwardAuthenticated } = require('../services/authentication/auth');


////////////////////////////////////////      INDEX ROUTES      ////////////////////////////////////////////


// Welcome Route
router.get('/', (req, res) => {
    return res.status(200).json("Welcome to Mvp Match API")
});


// Authenticated Home route
router.get('/home', checkAuthenticated, (req, res) => {
    return res.status(200).json({ "message": "Successful! You can now perform operations on products" })
});


////////////////////////////////////////   USERS ROUTES    ////////////////////////////////////////////



// CREATE USER
router.post('/createUser', forwardAuthenticated, createUser);

// Get Single User
router.get("/getUser/:_id", checkAuthenticated, getUser)

//Update Single User
router.post("/updUser/:_id", checkAuthenticated, updateUser)


// Delete User
router.delete("/deluser/:id", checkAuthenticated, deleteUser);


// Deposit
router.post("/deposit/:id", checkAuthenticated, authBuyer, depositFunds);

// Buy
router.get("/buy", checkAuthenticated,authBuyer, buy);

// Buy
router.get("/reset", checkAuthenticated, authBuyer, reset);



////////////////////////////////////////   PRODUCTS ROUTES   ////////////////////////////////////////////



// CREATE PRODUCT
router.post('/createProduct', checkAuthenticated, authSeller, createProduct);



// Get Single Product - No authentication (Can be called by anyone)
router.get("/getProd/:_id", forwardAuthenticated, getProduct)

//Update Single Product
router.post("/updProd/:_id", checkAuthenticated, updateProduct )


// Delete Product
router.delete("/delProd/:id", checkAuthenticated, authSeller, deleteProduct);


module.exports = Router;