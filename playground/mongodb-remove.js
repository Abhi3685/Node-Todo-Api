const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	db.collection("Todos").deleteMany({text: "Something to do"}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	db.collection("Todos").deleteOne({text: "This task is done"}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	db.collection("Todos").findOneAndDelete({text: "This task is not done"}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	db.collection("Users").deleteMany({name: "Abhishek"}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	db.collection("Users").findOneAndDelete({_id: new ObjectID('5c2c79fd187fefe4069e164f')}).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	client.close();
});