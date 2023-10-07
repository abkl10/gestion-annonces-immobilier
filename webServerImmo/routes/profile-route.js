var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    //render a profile vue
    const user=req.user;
    res.render('profile',{
       user: user
    });
});

module.exports = router;
