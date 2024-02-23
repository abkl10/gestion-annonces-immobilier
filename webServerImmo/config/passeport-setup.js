const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const keys=require('./keys');
const User=require('../models/user-models');
const LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
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
        //options for the strategy
        callbackURL:'/auth/google/redirect',
        clientID:keys.google.clientId,
        clientSecret:keys.google.clientSecret
    },(acessToken, refreshToken, profile, done) => {

        // passport callback function
        /*
    console.log("abkl passport callback function fired");
    console.log(profile);*/
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

passport.use('login', new LocalStrategy({
    passReqToCallback: true
}, function (req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'username': username })
        .exec() // Remove the callback here
        .then(user => {
            // Username does not exist, log error & redirect back
            if (!user) {
                console.log('User Not Found with username ' + username);
                return done(null, false, req.flash('message', 'User Not found.'));
            }

            // User exists but wrong password, log the error
            if (!isValidPassword(user, password)) {
                console.log('Invalid Password');
                return done(null, false, req.flash('message', 'Invalid Password'));
            }

            // User and password both match, return user from
            // done method which will be treated like success
            return done(null, user);
        })
        .catch(err => {
            // Handle any errors that occurred during the query
            return done(err);
        });
}));


passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        findOrCreateUser = function () {
            // Find a user in Mongo with the provided username
            User.findOne({ 'username': username }).exec() // Use exec() to return a Promise
                .then(user => {
                    if (user) {
                        console.log('User already exists');
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // If there is no user with that username, create the user
                        var newUser = new User();
                        // Set the user's local credentials
                        newUser.nom= req.param('nom');
                        newUser.prenom = req.param('prenom');
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        if(req.body.role) {
                            newUser.role = req.body.role;
                        }
                        // Save the user
                        return newUser.save()
                            .then(savedUser => {
                                console.log('User Registration successful');
                                return done(null, savedUser);
                            })
                            .catch(err => {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            });
                    }
                })
                .catch(err => {
                    console.log('Error in SignUp: ' + err);
                    return done(err);
                });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }));




// Generates hash using bCrypt

var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

}
var isValidPassword = function(user, password){

    return bCrypt.compareSync(password, user.password);
}

