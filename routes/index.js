var Room = require('../models/Room');
var SHA256 = require("crypto-js/sha256");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '¿SuperSecret?' });
};

exports.new_room = function(req, res){
  createRoom(res)
};

exports.messages = function(req, res){
  var post = req.body;
  Room.findOne({roomID: post.roomID},'messages', function(err, room){
    if(room && !err){
      res.json({messages: room.messages});
    }else{
      res.json({messages: []});
    }
    return;
  });
};

exports.valid = function(req, res){
  var post = req.body;
  Room.count({roomID: post.roomID}, function(err, count){
    res.json({valid: count == 1});
    return;
  });
}

exports.new_message = function(req, res){
  var post = req.body;
  Room.findOne({roomID: post.roomID},'messages',function(err, room){
    if(room && !err){
      room.messages.push(post.message);
      room.save();
    }
    res.send(200);
  });
}

function generate256() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 50; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return SHA256(text).toString();
}

function createRoom(res) {
  var roomID = generate256();
  Room.count({roomID: roomID}, function(err, count){
    if (count == 0){
      new Room({roomID: roomID}).save(function (err,room){
          res.json({roomID: roomID});
      });
    }else{
      getRoom();
    }
    return;
  });
}
