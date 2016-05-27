var express = require('express');
var router = express.Router();
var getJson = require('../utility/getJson.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getInfo', function(req, res) {
    getJson(req, res);
});

module.exports = router;
