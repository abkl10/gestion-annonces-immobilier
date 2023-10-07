var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookiesession=require('express-session');
var passportSetup=require("./config/passeport-setup");
var keys=require("./config/keys");
const mongoose = require('mongoose')
var passport=require("passport");
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var annoncesRouter=require('./routes/annonces');
var usersRouter = require('./routes/users');
var authRoutes=require('./routes/auth-routes');
var profileRoutes=require('./routes/profile-route');
const Annonce=require('./models/annonces')
const fileUpload = require("express-fileupload");

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);
//encrypt our cookie
app.use(cookiesession({
    maxAge: 24*60*60*1000,
    secret: [keys.session.cookieKey]
}));

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

//setUp routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.use('/ad',annoncesRouter);


mongoose.connect('mongodb://localhost:27017/').then(() => {
    console.log('Database connected')
}).catch((e) => {
    console.log(e.message)
})



// Gestionnaire d'erreurs
app.use(function(err, req, res, next) {
    // Configuration des variables locales, fourniture de l'erreur uniquement en mode développement
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Renvoi de la page d'erreur avec le code d'erreur approprié
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;











/*
const newAnnonce = new Annonce({
    titre: "Sample Title",
    type: "location",
    publication: true,
    statut: "disponible", // Use 'disponible' instead of 'available'
    description: "Sample description",
    prix: 1000,
    // date will default to the current date
});

// Save the document to the database
newAnnonce.save()
    .then(savedAnnonce => {
        console.log("Annonce saved successfully:", savedAnnonce);
    })
    .catch(error => {
        console.error("Error saving annonce:", error);
    });
*/