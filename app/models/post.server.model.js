var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: {
		type: String,
		required: true;
	},
	content: {
		type: String;
		required: true
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User' //ref tells mongoose that the author field will use the User model to populate the value 
	}
});



mongoose.model('Post', PostSchema);