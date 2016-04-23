var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  soul: { type: mongoose.Schema.Types.ObjectId, ref: 'Soul' }
});

mongoose.model('Comment', CommentSchema);
