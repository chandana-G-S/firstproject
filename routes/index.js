var express = require('express');
var router = express.Router();
var controller = require('../controller')
router.use('/',controller)
module.exports=router;
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
