const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

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
			return res.status(400).send();
		}
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	});
});

app.delete('/todo/:id', (req, res) => {
	var todoId = req.params.id;

	Todo.findByIdAndRemove(todoId, (err, todo) => {
		if(err) {
			return res.status(400).send();
		}
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	});
});

app.patch('/todo/:id', (req, res) => {
	var todoId = req.params.id;
	var body = {};
	var completedAt;

	if(req.body.text) body.text = req.body.text;
	if(req.body.completed) body.completed = req.body.completed;

	if(req.body.completed === true){
		completedAt = new Date().getTime();
	} else {
		body.completed = false;
		completedAt = null;
	}
	body.completedAt = completedAt;

	Todo.findByIdAndUpdate(todoId, { 
		$set: body
	}, 
	{ new: true }, 
	(err, todo) => {
		if(err) {
			return res.status(400).send();
		}
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	});
});

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});
