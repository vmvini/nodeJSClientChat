var jwt = require('jwt-simple');
var secretKey = new Buffer("201u30i2j1sok21mslkmlisua9uw103j21knkns.,M,X.NJHUWHQIWU2HK3J1NS09JOKNXSXKMSANDKJOWIEJ12O").toString('utf8');

function decryptToken(token){
		
		var decoded = jwt.decode(token, secretKey);
		console.log(decoded);
		return decoded;
		//se nao lançar erro, é pq decodificou corretamente.
}


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
	api.use(function(req, res, next){

		console.log("verificando se possui autenticação");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];


		//verificar se token existe
		if(token){
			try{
				var decoded = decryptToken(token);
				console.log("token decodificado");
				console.log(decoded);
				req.decoded = decoded;
				next();
			}
			catch(e){
				//erro de
				res.status(403).send({success:false, message:"Failed to authenticate user"});
			}

		} else{
			//token nao existe
			res.status(403).send({success:false, message:"No token provided"});
		}

	}); 
	
	//TUDO DEPOIS DESSE MIDDLEWARE PRECISA ESTAR AUTENTICADO


	//ENVIAR MENSAGEM
	api.post('/enviarMensagem', function(req, res){
		
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        var command = "escreverMensagem?email="+req.decoded.email+"&grupoId="+req.body.grupoId+"&conteudo="+req.body.conteudo+"&sessionToken="+token;
		clientSocket.destroy();
		clientSocket = require('../clientSocket.js')(io);
		
		clientSocket.write(command);
	});

	//INSCREVER EM GRUPO
	api.post('/inscreverEmGrupo', function(req, res){
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		var command = "entrarGrupo?email="+req.body.email+"&grupoId="+req.body.grupoId+"&sessionToken="+token;
		clientSocket.destroy();
		clientSocket = require('../clientSocket.js')(io);
		
		clientSocket.write(command);
		res.json({msg:"success"});
	});



	api.get('/me', function(req, res){
		res.json(req.decoded);
	});



	//DESLOGAR
	api.post('/logout', function(req, res){
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		var command = "sair?token="+token;
		//verificar antes se socket ta ativo
		clientSocket.destroy();
		clientSocket = require('../clientSocket.js')(io);
		
		clientSocket.write(command);
		res.json({msg:"logout"});
	});


	return api;
}