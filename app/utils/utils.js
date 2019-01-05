const jwt = require('jsonwebtoken');
var {User} = require('./../models/user');

function generateAuthToken(user, callback) {
	var tokens = user.tokens;
	var token = {
		access: 'auth',
		token: jwt.sign({ id: user._id, access: 'auth' }, 'abc123').toString()
	};
	tokens.push(token);
	User.findByIdAndUpdate(user._id, { $set: { tokens } }, { new: true }, (err, user) => {
		if(err){
			callback(err);	
		} else {
			callback(null, user);	
		}
	});
}

module.exports = {
	generateAuthToken
}