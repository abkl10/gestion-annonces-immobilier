var express = require('express');
var router = express.Router();

//cannot access to the profile page if not connected
const authCheck=(req, res, next)=>{
    if(!req.user){
        //7if user not log in
        res.redirect('/auth/login');
    }else{
        next();//go on of the next piece of the middleware
    }
}
router.get('/',authCheck,(req,res)=>{
    //res.send("you are loged in this is your profile- "+ req.user.username);
    //render a profile vue
    const user=req.user;
    res.render('profile',{
       user: user
    });
});

module.exports = router;