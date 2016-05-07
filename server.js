//CARREGANDO DEPENDENCIAS
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs-extra');  
var morgan = require('morgan');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//APLICAÇÃO EXPRESS USANDO BODY PARSER PARA TRATAR OS DADOS DOS FORMULARIOS DAS REQUISIÇÕES
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(morgan('dev'));

//DEFININDO DIRETORIO PARA CONTEUDOS ESTATICOS DA APLICAÇÃO
app.use(express.static(__dirname + '/public'));

//CRIANDO SOCKET DE CONEXÃO COM O CLIENTE JAVA.
var clientSocket = require('./app/clientSocket')(io); //CLIENTE DO SOCKET DO JAVA

//INSTANCIANDO REST API
var api = require('./app/routes/api')(app, express, fs, clientSocket );
app.use('/api', api);


//RESPOSTA PADRÃO PARA QUALQUER LINK NAO RECONHECIDO
app.get('*', function(req, res){
	
	res.sendFile(__dirname + '/public/app/views/index.html');
	
});

//SERVIDOR WEB ESCUTANDO NA PORTA 3010
http.listen(3000, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Escutando na porta 3000");
	}
});



