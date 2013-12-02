var roomID, passkey;

$(function(){

  $('#room_create').click(function(){
    var passkey = generate256();
    $.post('/new_room',function(data){
      roomID = data.roomID;
      $('.roomID').text(roomID);
      $('.passkey').text(passkey);
      $('.create_area').find('p').removeClass('hidden');
    },'json');
  });

  $('#enter').click(function(){
    passkey = $('#passkey').val();
    roomID = $('#roomID').val();
    $.post('/valid', {roomID: roomID}, function(data){
      if(data.valid){
        $.post('/messages',{roomID: roomID}, function(data){
          $('.login').remove();
          $('.messages').removeClass('hidden');
          var textarea = $('.messages').find('textarea');
          var messages = data.messages;
          for(var i = 0; i < messages.length; i++){
            var message = CryptoJS.AES.decrypt(messages[i],passkey).toString(CryptoJS.enc.Utf8);
            textarea.text(textarea.text() + message+"\n");
          }
        });
        socket.on('message', function (data) {
          if(data.roomID == roomID){
            var textarea = $('.messages').find('textarea');
            var message = CryptoJS.AES.decrypt(data.message,passkey).toString(CryptoJS.enc.Utf8);
            textarea.text(textarea.text() + message+"\n");
          }
        });
      }
    });
  });

  $('#send').click(function(){
    var unencrypted = $('#entry').val();
    var encrypted = CryptoJS.AES.encrypt(unencrypted, passkey).toString();
    var textarea = $('.messages').find('textarea');
    $.post('/new_message',{roomID: roomID, message: encrypted},function(){
      var text = textarea.text();
      textarea.text(text+unencrypted+"\n");
      $('#entry').val('');
    });
    socket.emit('message', {message: encrypted, roomID: roomID});
  });
});


function generate256() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 50; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return CryptoJS.SHA256(text).toString();
}
