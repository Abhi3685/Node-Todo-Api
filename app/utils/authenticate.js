var utils = require('./utils');

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');

	utils.findByToken(token, (err, user) => {
		if(err && !user) res.status(401).send();
		else {
			req.user = {_id: user._id, email: user.email};
			req.token = token;
			next();
		} 
	});
};

module.exports = {
	authenticate
};