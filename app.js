//npm run dev to execute
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

mongoose.connect("mongodb://localhost/auth_prac", {useNewUrlParser : true})
	.then(() => console.log("db connected"))
	.catch(err => console.log(err));

const app = express();

//Passport config
require("./config/passport")(passport);


//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({extended : false}));

//Express Session
app.use(session({
	secret : "secret",
	resave : false,
	saveUninitialized : true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next(); 
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(3000, () => {
	console.log("Server started");
});