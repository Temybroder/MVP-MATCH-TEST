const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const User = require("../models/Users")
const Product = require("../models/Products")

const ApiError = require("../middlewares/apiErrors");


const createUser = (req, res, next) => {
    const { userName, password, password2, deposit, role} = req.body;
    let errors = [];
  
    if (!userName || !password || !deposit || !role) {
      errors.push({ msg: 'Please enter all fields' });
    }
    // This check is to ensure user's confirm password is same as original password
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      next(ApiError.badClientRequest({error: errors} ));
      return;
    } else {
      User.findOne({ userName: userName }).then(user => {
        if (user) {
          errors.push({ message: 'User already exists' });
          next(ApiError.badClientRequest({error: errors} ));
          return;
        } else {
  
          const newUser = new User(
          {
            _id: new mongoose.Types.ObjectId(),
            userName: userName,
            password : password,
            role: role,
           deposit: deposit,
           authorizationLevel: ""
          }
          );
          // Hash the password before storing
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.status(200).json({ "message": "User successfully created" })
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  }


  const getUser = (req, res, next) => {
    var userId = req.params._id;
    User.findById(userId)
    .exec(function(err, user){
      if (err) {
        next(ApiError.badClientRequest('There was an error with this action. Please try again'));
        next(); 
        }
      res.status(200).json({ user: user })
    })
  }


  const updateUser = (req, res, next) => {
    var userId = req.params._id;
    User.findByIdAndUpdate(userId, 
      { $set: {
        userName: req.body.userName,
        
      }}, 
      { new: true }, function (err, user) {
       if (err){
        next(ApiError.badClientRequest('There was an error with this action. Please try again'));
        return;
       }
    })
  }


  const deleteUser = async (req, res, next) => {
	try {
		await User.deleteOne({ _id: req.params.id })
		res.status(200).json({ "message": "User successfully deleted" })
    return;
	} catch {
		next(ApiError.resourceNotFound('User not found.'));
    return;
	}
}


const createProduct = (req, res, next) => {

    const { productName, cost, amountAvailable } = req.body;
    let errors = [];
  
    if (!productName || !cost || !amountAvailable ) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if ((cost % 5) != 0) {
      errors.push({ message: 'Cost must be in multiple' });
    }
  
    if (errors.length > 0) {
      res.status(400).json( {error: errors} );
      return;
    } else {
      Product.findOne({ productName: productName }).then(product => {
        if (product) {
          errors.push({ message: 'Product already exists' });
          next(ApiError.badClientRequest({error: errors} ));
          return;
        } else {
  
          const newProduct = new Product(
          {
            _id: new mongoose.Types.ObjectId(),
            productName: productName,
            cost : cost,
            amountAvailable: amountAvailable,
            sellerId: ""
          }
          );
          
          newProduct
            .save()
            .then(product => {
              res.status(200).json({ "message": "Product successfully created" })
            })
            .catch(err => console.log(err));
        }
      });
    }
  }


  const getProduct = (req, res, next) => {
    var productId = req.params._id;
    Product.findById(productId)
    .exec(function(err, product){
      if (err) {
        next(ApiError.badClientRequest('There was an error with this action. Please try again'));
        next(); 
        }
      res.status(200).json({ product: product })
    })
  }


  const updateProduct = (req, res, next) => {
    Product.findById(productId)
    .exec(function(err, product){
      if (err) {
        next(ApiError.badClientRequest('There was an error with this action. Please try again'));
        return;
          } else {
            //if it is seller, grant access
            if (product.sellerId == req.user._id){
                
          var productId = req.params._id;
          Product.findByIdAndUpdate(productId, 
            { $set: {
              clearance: "Verified"
            }}, 
            { new: true }, function (err, product) {
            if (err){
              next(ApiError.badClientRequest('There was an error with this action. Please try again'));
              return;
            } else {
              res.status(200).json({ "message": "successful" })
            }
          })
        } else {
          next(ApiError.unauthorized('Unauthorized: You lack sufficient priviledges to access this Resource'));
          return;
      }
  }
})
 }


  const deleteProduct = async (req, res, next) => {
	try {
     Product.findById(productId)
    .exec( async function(err, product){
      if (err) {
        next(ApiError.badClientRequest('There was an error with this action. Please try again'));
        return;
        } else {
            //if it is seller, grant access
            if (product.sellerId == req.user._id){
          await Product.deleteOne({ _id: req.params.id })
          res.status(204).json({ "message": "Product successfully deleted" })
          return;
        } else {
          next(ApiError.unauthorized('Unauthorized: You lack sufficient priviledges to access this Resource'));
          return;
          }
        }
      })
    } catch {
      next(ApiError.resourceNotFound('Error: Product does not exist!'));
      return;
	}
}


const depositFunds = ( req, res ) => {

          //if it is buyer, grant access
          if (req.user.role == "buyer"){

            const depositValue = req.body.deposit;
            const depositSums = [5, 10, 20, 50, 100];
            if(  depositSums.indexOf(depositValue)  >  -1  ){
            User.findByIdAndUpdate(userId, 
              { $set: {
                deposit: depositValue
              }}, 
              { new: true }, function (err, updatedWithDeposit) {
              if (err){
                next(ApiError.badClientRequest('There was an error with this action. Please try again'));
                return;
              } else {
                res.status(200).json({ "message": "successfully deposited" })
              }
            }) } else {
              next(ApiError.badClientRequest('Bad request. Please Put one of 5, 10, 20, 50, 0r 100'));
              return;
            }
        return;
      } else {
        next(ApiError.unauthorizedError('You do not have sufficiet priviledges for this action'));
        return;
        }

}

const buy = (req, res, next) => {
  if (req.user.role == "buyer"){
    const { productId, amountOfProducts } = req.body;
    // Check number of products so Buyer can only buy one product at a time
    if( amountOfProducts == 1 ) {
    Product.findById(productId)
    .exec( async function(err, product){
      if (err) {
        next(ApiError.resourceNotFound({ "message": "Product does not exist" }));
        return;
        } else {
           // Proceed to buy Product
           let newDepositValue = req.user.deposit - product.cost;
           let spent = product.cost;
           let productPurchased = product.name;
           // Function to calculate change
           function calculateChange (amount) {
            if(amount > 0){
            let change = [];
            let denominations = [100, 50, 20, 10, 5];
            for (let i = 0; i < denominations.length; i++){
              if( amount / denominations[i] >= 1 ){
                change.push(denominations[i]);
              }
              change = change - denominations[i];
            }
            return change;
          }
            else {
              let change = 0;
              return change;
            }
           }
           let changeRemaining = calculateChange(newDepositValue);
           User.findByIdAndUpdate(userId, 
            { $set: {
              deposit: newDepositValue
            }}, 
            { new: true }, function (err, userUpdatedWithDeposit) {
            if (err){
              next(ApiError.badClientRequest('There was an error. Please try again'));
              return;
            } else {
              res.status(200).json({ "message": "successfully deposited", "body" : {
                 "amountSpent": spent,
                 "productPurchased": productPurchased,
                 "change": changeRemaining
                } })
              }
            })
          }
        })
        } else {
          next(ApiError.badClientRequest('You can not purchase more than one Product at a time'));
      return;
      }
     } else {
      next(ApiError.badClientRequest('You do not have sufficiet priviledges for this action'));
    return;
  }
}


   const reset = (req, res, next) => {
        if( req.user.role == "buyer" ) {
          User.findByIdAndUpdate(req.user._id, 
            { $set: {
              deposit: 0
            }}, 
            { new: true }, function (err, updatedUser) {
            if (err){
              next(ApiError.badClientRequest('There was an error. Please try again'));
              return;
            } else {
              res.status(200).json({ "message": "Reset successful" });
              return;
            }
          })
        } else {
          next(ApiError.badClientRequest('You do not have sufficiet priviledges for this action'));
          return;
        }
    }

const signOutSessions = (req, res, next) => {
  var userId = req.user.id;
  var filter = {'session':{'$regex': '.*"user":"'+userId+'".*'}};

  Session.remove(filter,function(err,data){
      if(err){
         res.redirect('/home');
         return;
      } else {
      req.logout();
        res.redirect('/');
        return;
      }
  });
};

module.exports = {createUser, getUser, updateUser, deleteUser, createProduct, getProduct, updateProduct, deleteProduct, signOutSessions, depositFunds, buy, reset };