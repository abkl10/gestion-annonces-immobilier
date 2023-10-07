const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const keys=require('./keys');
const User=require('../models/user-models');


passport.serializeUser((user, done)=>{
    done(null,user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
});


//loging using google take the profile create a new user if it's not exits in our db
//else look up then take it and grab the id and stuff it in a cookie
//encrypt it send it to the browser
passport.use(
    new googleStrategy({
    //options for the strategy x
    callbackURL:'/auth/google/redirect',
    clientID:keys.google.clientId,
    clientSecret:keys.google.clientSecret
},(acessToken, refreshToken, profile, done) => {


    //check if user aleready exists in our db
    User.findOne({
         googleId:profile.id
    }).then((currentUser)=>{
        if(currentUser){
            //aleready have the user
         console.log("user is : ",currentUser);
         done(null, currentUser);
        }else{
            //if not create the user in our db
            //create a new user
            new User({
                username:profile.displayName,
                googleId:profile.id
            }).save().then((newUser) => {
                console.log('New user created:', newUser); // Returns promise
                done(null, newUser); // Move this line inside the .then block
            });
        }
    });
        })
);