const { ObjectID } = require('mongodb');

var { mongoose } = require('./../app/db/mongoose');
var { Todo } = require('./../app/models/todo');
var { User } = require('./../app/models/user');

var id = '5c2e401579bc3121885d29d8';
var userId = '5c2cc81b2cc5ea2e983cff97';

if(!ObjectID.isValid(id)){
	console.log('Id is invalid');
} else {
	Todo.findById(id, (err, todo) => {
		if(!todo) return console.log('Id not found');
		console.log('Todo By Id', todo);
	});
}

Todo.find({ _id: id }, (err, todos) => {
	console.log('Todos', todos);
});

Todo.findOne({ _id: id }, (err, todo) => {
	console.log('Todo', todo);
});

User.findById(userId, (err, user) => {
	if(err){
		console.log(err);
	} else if(!user){
		console.log('User Not Found!');
	} else {
		console.log('User', user);
	}

});
