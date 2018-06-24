let express = require('express');
let router = express.Router();


/* GET home page. */


router.get('/counter', function(req, res, next) {
    console.log('llegue aca papu');



});

router.get('/registration', function(req, res, next) {
    res.render('registration' );
});

module.exports = router;
