
module.exports = function(io)
{

	//SOCKET DE CONEXAO COM O SERVIDOR JAVA
	var conn = require('net').createConnection(10889);

	conn.on('connect', function(){
		console.log("conectado ao servidor");

		conn.on('error', function(err){
			console.log("Erro na conexao:", err);

		});

		conn.on('data', function(msg){
			console.log("mensagem recebida: |" + msg + "|");
			
			if(new String(msg).indexOf("token:") > -1){
				var token = new String(msg).replace("token:", "");
				io.emit("sessiontoken", {token:token} );
			}
			else{
				io.emit(new String(msg), {});
			}
			
			

		});
		
	});

	

	

	return conn;

}
