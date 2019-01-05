const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
	      validator: value => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value),
	      message: props => `${props.value} is not a valid email!`
	    }
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

var User  = mongoose.model('User', UserSchema);

module.exports = {
	User
};
