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

function findByToken(token, callback) {
	var decoded;
	try {
		decoded = jwt.verify(token, 'abc123');
		User.findOne({
			'_id': decoded.id,
			'tokens.access': 'auth',
			'tokens.token': token
		}, (err, user) => {
			if(err){
				callback(err);
			} else {
				callback(null, user);
			}
		});
	} catch(e) {
		callback(e);
	}
}

module.exports = {
	generateAuthToken,
	findByToken
}