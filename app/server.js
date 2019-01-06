const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var utils = require('./utils/utils');

var app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

var authenticate = function(req, res, next){
	var token = req.header('x-auth');

	utils.findByToken(token, (err, user) => {
		if(err) res.status(401).send(err);
		else {
			req.user = {_id: user._id, email: user.email};
			req.token = token;
			next();
		} 
	});
};

app.post('/todo', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save((err, todo) => {
		if(err) {
			res.status(400).send(err);
		} else {
			res.send(todo);
		}
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}, (err, todos) => {
		if(err){
			res.status(400).send(err);
		} else {
			res.send(todos);
		}
	});
});

app.get('/todo/:id', authenticate, (req, res) => {
	var todoId = req.params.id;

	Todo.findOne({
		_id: todoId,
		_creator: req.user._id
	}, (err, todo) => {
		if(err) {
			return res.status(400).send();
		}
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	});
});

app.delete('/todo/:id', authenticate, (req, res) => {
	var todoId = req.params.id;

	Todo.findOneAndRemove({
		_id: todoId,
		_creator: req.user._id
	}, (err, todo) => {
		if(err) {
			return res.status(400).send();
		}
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	});
});

app.patch('/todo/:id', authenticate, (req, res) => {
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

	Todo.findOneAndUpdate({
		_id: todoId,
		_creator: req.user._id
	}, { 
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

app.post('/user', (req, res) => {
	var body = {};
	if(req.body.email) body.email = req.body.email;
	if(req.body.password) body.password = req.body.password;

	var user = new User(body);

	user.save((err, user) => {
		if(err) {
			res.status(400).send(err);
		} else {
			utils.generateAuthToken(user, (err, tokenUser) => {
				if(err) res.status(400).send(err);
				else res.header('x-auth', tokenUser.tokens[0].token).send({_id: tokenUser._id, email: tokenUser.email});
			});
		}
	});
});

app.get('/user/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/user/login', (req, res) => {
	var body = {};
	if(req.body.email) body.email = req.body.email;	
	if(req.body.password) body.password = req.body.password;

	utils.findByCredentials(body.email, body.password, (err, user) => {
		if(err) res.status(400).send({err});
		else {
			utils.generateAuthToken(user, (err, tokenUser) => {
				if(err) res.status(400).send(err);
				else res.header('x-auth', tokenUser.tokens[0].token).send({_id: tokenUser._id, email: tokenUser.email});
			});
		}
	});
});

app.delete('/user/me/logout', authenticate, (req, res) => {
	utils.removeToken(req.token, (err, user) => {
		if(err) res.status(400).send(err);
		res.send();
	});
});

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});
