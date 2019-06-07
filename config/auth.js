//add this to any page that you want to protect

module.exports = {
	ensureAuthenticated : function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash("error_msg", "Please log in to view this resource");
		res.redirect("/users/login");
	}
}