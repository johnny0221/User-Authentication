const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User model
const User = require("../models/User");

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	//get those value in the object
	const {name, email, password, password2} = req.body;
	let errors = [];

	//check the required fields
	if(!name || !email || !password || !password2) {
		errors.push({msg : "Please fill in all the fields"});
	}

	//check the password = password2
	if(password !== password2) {
		errors.push({msg : "Passwords do not match"});
	}

	if(password.length < 6) {
		errors.push({msg : "Password should be at least 6 characters"});
	}

	if(errors.length > 0) {
		res.render("register", {errors, name, email, password, password2});
	} else {
		//Validation passed
		User.findOne({email : email})
			.then(user => {
				if(user) {
					//User exists
					errors.push({msg : "Email is already registered"});
					res.render("register", {errors, name, email, password, password2});
				} else {
					const newUser = new User({
						name : name,
						email : email,
						password : password
					});

					//Hash Password
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser['password'], salt, (err, hash) => {
							if(err) {
								console.log("problem with hasing");	
							} else {
								//set the password in the db hashed version
								newUser['password'] = hash;
								newUser.save((err, newUser) => {
									if(err) {
										console.log("User not saved in the db");
									} else {
										console.log("User successfully saved in the db");
										//create flash msg after successfully create
										req.flash("success_msg", "You are now registered to log in");
										res.redirect("/users/login");
									}
								});
							}
						});
					});

				}
			});
	}

});

//Login Handle to correspond with the LocalStragy
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect : "/dashboard",
		failureRedirect : "/users/login",
		failureFlash : true
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "Successfully logged out");
	res.redirect("/users/login");
});


module.exports = router;
