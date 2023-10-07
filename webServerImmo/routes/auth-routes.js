var express = require('express');
var router = express.Router();
const passport = require('passport')


router.get('/login', async function(req, res, next) {
    res.render('login',{ title: 'Login'});
});

router.get('/logout',async function(req, res, next) {
    res.send('logging out');
});

// auth with google
//handle with passeport
router.get('/google', passport.authenticate('google', {
    scope:['profile','email']//what we want to retrieve from the profile(infos)
}));


//callback route for google to redirect to
//we have a code in the url
/*
passport sees the code so in place of redirecting us to the consent screen again
so the developer want to take the code and exchange with profile infos
 */
router.get('/google/redirect',passport.authenticate('google'),(req, res) =>{
    console.log("user auth",req.user);
    res.send('Welcome to your profile')
});



router.get('/signup', function(req, res){
    res.render('register',{message: 'Register'});
});

module.exports = router;


