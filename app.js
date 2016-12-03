var express = require('express');
var app = express();
var parse = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
var connection = mongoose.connection;

var messageSchema = new mongoose.Schema({
	id: { type: Number, unique: true },
	message: String
});

var Message = mongoose.model('message', messageSchema);

mongoose.counter = 0;

app.use(parse.urlencoded({extended: true}));
app.use(parse.json());
app.use(function(req, res, next) {
	console.log('IT WORKS!');
	next();
});

app.get('/api/posts', function(req, res) {
	Message.find(function(error, messages) {
		if(error) {
			console.log('failed to retrieve messages error:', error);
			res.json('doesn\'t work');
		} else {
			console.log('works');
			res.json(messages);
		}
	});
});

app.get('/api/posts:id', function(req, res) {
	Message.find({id:req.body.id}, function(error, message) {
		if(error) {
			console.log('failed to retrieve message error:', error);
			res.json('doesn\'t work');
		} else {
			res.json(message);
		}
	});
});

app.post('/api/posts', function(req, res) {
	var messageObj = new Message({ id: mongoose.counter, message: req.body.message});
	messageObj.save(function(error, obj) {
		if(error) {
			console.log('failed to post message:', error);
			res.json('doesn\'t work');
		} else {
			mongoose.counter++;
			res.json(obj);
		}
	});
});

app.put('/api/posts:id', function(req, res) {
	Message.findByIdAndUpdate({id: req.body.id}, req.body, {upsert: true}, function(error, message) {
		if(error) {
			console.log('failed to retrieve message error:', error);
			res.json('doesn\'t work');
		} else {
			res.json(message);
		}
	});
});

app.delete('/api/posts:id', function(req, res) {
	Message.find({id: req.body.id}).remove().exec(function(error, messages) {
		if(error) {
			console.log('failed to delete messages error:', error);
			res.json('doesn\'t work');
		} else {
			res.json(messages);
		}
	});
});

app.listen(4568);
console.log('It\'s running!');