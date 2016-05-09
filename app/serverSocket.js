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
    	    //SO VAI RECEBER MENSAGENS PENDENTES
    	    io.emit('messages', {all: data});

    	});
	});


	var server;

}