module.exports = function(io){


	//SOCKET DE CONEXAO COM O SERVIDOR JAVA
	var conn = require('net').createConnection(9090);

	conn.on('connect', function(){
		console.log("conectado ao servidor");
		
	});


	/*
		Quando essa conexao recebe mensagens a partir do cliente java
		esse handler irá tratar a mensagem e emitir o evento websocket correspondente 
		para que o angular js reflita o evento para o usuario
		
	*/
	conn.on('data', function(msg){
		
			console.log("mensagem recebida: |" + msg + "|");
			if(msg == "COD1"){
				//io.emit('COD1');
				console.log("comando COD1 executando");
			}	

			else if( msg == "COD2")
				//io.emit('COD2')
				console.log("comando COD2 executando");
			else
				console.log("comando desconhecido: " + msg);
	});

	conn.on('error', function(err){
		console.log("Erro na conexao:", err);
	});

	return conn;

}