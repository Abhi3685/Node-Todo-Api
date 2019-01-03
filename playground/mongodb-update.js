const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// db.collection("Todos").findOneAndUpdate({completed: false}, { $set: {completed: true} }, {returnOriginal: false}).then((result)=>{
	// 	console.log(result);
	// }, (err)=>{
	// 	console.log('Unable to fetch todos', err);
	// });

	db.collection("Users").findOneAndUpdate(
		{_id: new ObjectID('5c2c7a1b187fefe4069e1655')}, 
		{ $set: {name: 'Abhishek'}, $inc: {age: 1} }, 
		{returnOriginal: false}
		).then((result)=>{
		console.log(result);
	}, (err)=>{
		console.log('Unable to fetch todos', err);
	});

	client.close();
});