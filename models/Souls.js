var mongoose = require('mongoose');

var SoulSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  street: String,
  city: String,
  state: String,
  zip: Number,
  contacted: Date,
  lesson: Number,
  sent: Date,
  received: Date,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Soul', SoulSchema);
