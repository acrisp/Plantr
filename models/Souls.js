var mongoose = require('mongoose');

var SoulSchema = new mongoose.Schema({
  fullname: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  dateContacted: { type: Date, default: Date.now },
  lessonNumber: { type: Number, min: 1, max: 8 },
  dateSent: { type: Date, default: Date.now },
  dateReceived: Date,
});

mongoose.model('Soul', SoulSchema);
