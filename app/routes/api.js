//REST API
module.exports = function(app, express, fs, clientSocket){

	var api = express.Router();

	//CADASTRO DE USUARIO
	api.get('/cadastrarUsuario', function(req, res){
		console.log("CADASTRANDO USUARIO");
		//enviando para cliente java o comando CADASTRAR_USUARIO
		clientSocket.write('CADASTRAR_USUARIO');
		//enviando resposta para pagina web
		res.json({msg:"success"});
	});


	//LOGIN DE USUARIO
	api.get('/login', function(req, res){
		//enviando para cliente java o comando LOGIN
		clientSocket.write('LOGIN');
		res.json({msg:"login_success"});
	});

	//ENVIAR MENSAGEM
	api.post('enviarMenssagem', function(req, res){
		clientSocket.write('ENVIAR_MENSSAGEM');
	});

	//INSCREVER EM GRUPO
	api.post('inscreverEmGrupo', function(req, res){

	});

	return api;
}