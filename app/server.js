var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todo', (req, res) => {
	var todo = new Todo(req.body);

	todo.save((err, todo) => {
		if(err) {
			res.status(400).send(err);
		} else {
			res.send(todo);
		}
	});
});

app.get('/todos', (req, res) => {
	Todo.find({}, (err, todos) => {
		if(err){
			res.status(400).send(err);
		} else {
			res.send(todos);
		}
	});
});

app.get('/todo/:id', (req, res) => {
	var todoId = req.params.id;

	Todo.findById(todoId, (err, todo) => {
		if(err) {
			return res.status(404).send();
		}
		if(!todo) {
			return res.status(400).send();
		}
		res.send(todo);
	});
});

app.listen(3000, ()=>{
	console.log('Started on port 3000');
});
