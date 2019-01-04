const { ObjectID } = require('mongodb');

var { mongoose } = require('./../app/db/mongoose');
var { Todo } = require('./../app/models/todo');
var { User } = require('./../app/models/user');

Todo.remove({}, (err, res) => {
	if(err) throw err;
	console.log(res);
});

Todo.findOneAndRemove({ _id: "5c2f15130db9a42a20a70def" }, (err, todo) => {
	if(err) throw err;
	console.log(todo);
});

Todo.findByIdAndRemove("5c2f15130db9a42a20a70def", (err, todo) => {
	if(err) throw err;
	console.log(todo);
});
