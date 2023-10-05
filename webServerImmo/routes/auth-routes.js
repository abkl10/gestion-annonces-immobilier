var express = require('express');
var router = express.Router();


router.get('/login', async function(req, res, next) {
    res.render('login',{ title: 'Login'});
});

router.get('/logout',async function(req, res, next) {
    res.send('logging out');
});

router.get('/google',async function(req, res, next) {
    res.send('logging with google');
});
router.get('/signup', function(req, res){
    res.render('register',{message: 'Register'});
});

module.exports = router;
