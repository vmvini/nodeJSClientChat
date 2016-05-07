//REST API
module.exports = function(app, express, fs, clientSocket){

	var api = express.Router();

	//CADASTRO DE USUARIO
	api.post('/cadastrarUsuario', function(req, res){
		console.log("CADASTRANDO USUARIO");
		//enviando para cliente java o comando CADASTRAR_USUARIO
		clientSocket.write('CADASTRAR_USUARIO');
		//enviando resposta para pagina web
		res.json({msg:"success"});
	});


	//LOGIN DE USUARIO
	api.post('/login', function(req, res){
		//enviando para cliente java o comando LOGIN
		clientSocket.write('LOGIN');
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
		clientSocket.write('ENVIAR_MENSSAGEM');
	});

	//INSCREVER EM GRUPO
	api.post('inscreverEmGrupo', function(req, res){

	});

	return api;
}