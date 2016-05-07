var jwt = require('jwt-simple');
var secretKey = new Buffer("vmvini").toString('utf8');

function decryptToken(token){
		
		var decoded = jwt.decode(token, secretKey);
		console.log(decoded);
		//se nao lançar erro, é pq decodificou corretamente.
}

module.exports = function(io){


	//SOCKET DE CONEXAO COM O SERVIDOR JAVA
	var conn = require('net').createConnection(9091);

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
			else{
				//caso msg seja um token, tentar decodifica-lo
				decryptToken(new String(msg));
				
			}
	});

	conn.on('error', function(err){
		console.log("Erro na conexao:", err);
	});

	return conn;

}
