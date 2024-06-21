let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
  
// User Model
const { User }  = require('../Models/User.js');

// READ Users
router.route('/').get((req, res) => {
    User.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = router;