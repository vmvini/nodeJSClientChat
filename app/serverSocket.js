module.exports = function(io)
{

	var server = require('net').createServer();
	var port = 3020;

	server.on('listening', function(){
    	console.log('escutando na porta ', port);
	});


	server.on('connection', function(socket){
    	console.log('um cliente conectou');
    
    	socket.on('data', function(data){
    	    //SO VAI RECEBER MENSAGENS DO CHAT
    	    console.log("");
    	    io.emit('messages', { all: new String(data) });
			socket.write("SUCCESS");

    	});
	});



server.listen(port);


	return server;

}