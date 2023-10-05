var express = require('express');
var router = express.Router();


router.get('/login', async function(req, res, next) {
    res.render('login',{ title: 'Login'});
});

router.get('/signup', function(req, res){
    res.render('register',{message: Register});
});

module.exports = router;
