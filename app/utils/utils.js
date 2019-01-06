const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
			} else if(!user){
				callback({err: "No User Found"});
			} else {
				callback(null, user);
			}
		});
	} catch(e) {
		callback(e);
	}
}

function findByCredentials(email, password, callback) {
	User.findOne({email}, (err, user) => {
		if(err) callback(err);
		else {
			if(!user){
				err = "User Not Found";
				callback(err);
			} else {
				bcrypt.compare(password, user.password, (err, res) => {
					if(!res){
						err = "Incorrect Password";
						callback(err);
					} 
					else callback(null, user);
				});
			}
		}
	});
}

function removeToken(token, callback) {
	User.findOneAndUpdate({ 'tokens.token': token }, { $pull: { tokens: {token} } }, (err, user) => {
		if(err) callback(err);
		callback(null, user);
	});
}

module.exports = {
	generateAuthToken,
	findByToken,
	findByCredentials,
	removeToken
}