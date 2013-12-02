var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
  roomID: {
    type: String,
    index: {unique: true}
  },
  messages: [String]
});

module.exports = mongoose.model('Room', GameSchema);
