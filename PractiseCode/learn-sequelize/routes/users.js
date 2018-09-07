var express = require('express');
var User = require('../models').User;

var router = express.Router();


/* GET users listing. */
router.get('/', async(req, res, next) => {
  try {
    let users = await User.findAll();
    res.json(users);
  
  } catch(error) {
    console.error(err);
    next(error);
  }
});

router.post('/' ,function (req, res, next) {
  User.create({
    name : req.body.name,
    age : req.body.age,
    married : req.body.married,
  })
  .then((result) => {
    console.log(result);
    res.status(201).json(result);
  })
  .catch((err) => {
    console.error(err);
    next(err);
  });
});


module.exports = router;
