let User =  require('../models/User');

module.exports = {
  checkAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },
  forwardAuthenticated: (req, res, next) => {
  
    if ( !req.isAuthenticated()){
      return next();
    }
    else {
    res.redirect('/home', { 
      user: req.user
    }) 
    }}

};