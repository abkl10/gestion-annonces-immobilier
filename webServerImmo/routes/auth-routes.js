var express = require('express');
var router = express.Router();
const passport=require("passport");
const flash = require('connect-flash');

//auth loging
router.use(flash());
router.get('/login', async function(req, res, next) {
    res.render('login',{ title: 'Login'});
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash : true
}));
//auth logout
router.get('/logout', async function(req, res, next) {
    // handle with passport
    req.logout(function(err) {
        if (err) {
            // Handle any error that might occur during logout
            console.error(err);
        }
        res.redirect('/');
    });
});



// auth with google
//handle with passeport
//res.send("logging in with google");
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
    /*res.send("You reached a callback  URI");*/
    console.log("user auth",req.user);
    res.redirect('/profile/');
});


router.get('/signup', function(req, res){
    const role = req.query.role; // get the query parameters
    console.log(role); //test
    res.render('register',{message: req.flash('message'), role:role});
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/auth/signup',
    failureFlash : true
}));


module.exports = router;
