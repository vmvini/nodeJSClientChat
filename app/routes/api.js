//REST API
module.exports = function(app, express, fs, clientSocket, io){

	var api = express.Router();

	//CADASTRO DE USUARIO
	api.post('/cadastrarUsuario', function(req, res){
		
		var command = "cadastrarUsuario?nome="+req.body.nome+"&email="+req.body.email+"&senha="+req.body.senha;
		
		clientSocket.destroy();
		clientSocket = require('../clientSocket.js')(io);
		
		clientSocket.write(command);

		
		//enviando resposta para pagina web
		res.json({msg:"success"});
	});


	//LOGIN DE USUARIO
	api.post('/login', function(req, res){
		var command = "hasUsuario?email="+req.body.email+"&senha="+req.body.senha;
		//verificar antes se socket ta ativo
		clientSocket.destroy();
		clientSocket = require('../clientSocket.js')(io);
		
		clientSocket.write(command);
		res.json({msg:"login_success"});
	});


	//TUDO ANTES DESSE MIDDLEWARE NÃO PRECISA ESTAR AUTENTICADO
	//criando middleware que cuida de verificar se a cada requisiçao, existe um token de autenticaçao
	//pra criar o efeito de sessão
	/*api.use(function(req, res, next){

		console.log("somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//verificar se token existe
		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err){
					res.status(403).send({success:false, message:"Failed to authenticate user"});
				} else {
					//passou na validação
					//decoded ficara os dados decodificados do token, no caso`user id, name, username
					req.decoded = decoded;
					//ir para proxima rota
					next();
				}
			});
		} else{
			//token nao existe
			res.status(403).send({success:false, message:"No token provided"});
		}

	}); 
	*/
	//TUDO DEPOIS DESSE MIDDLEWARE PRECISA ESTAR AUTENTICADO


	//ENVIAR MENSAGEM
	api.post('enviarMensagem', function(req, res){
		//"escreverMensagem?email=" + usrEmail + "&grupoId=" + groupId+"&dateTime="+dateTime
                //+"&conteudo="+conteudo;

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        var command = "escreverMensagem?email="+req.decoded.email+"&grupoId="+req.body.grupoId+"&conteudo="+req.body.conteudo+"&sessionToken="+token;
		clientSocket.write('ENVIAR_MENSSAGEM');
	});

	//INSCREVER EM GRUPO
	api.post('inscreverEmGrupo', function(req, res){
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];


		var command = "entrarGrupo?email="+req.decoded.email+"&grupoId="+req.body.grupoId+"&sessionToken="+token;
		clientSocket.write(command);
		res.json({msg:"success"});
	});

	return api;
}