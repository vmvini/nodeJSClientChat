angular.module('grupoModule', [])

.controller('GrupoController', function(Auth, $rootScope, $location, $http, socketio, $routeParams){

	var vm = this;

	vm.loggedUser = {};
	Auth.getUser().then(function(resp){
		console.log("pegando usuario logado:");
		console.log(resp);
		vm.loggedUser = resp.data;
	});

	
	vm.grupoId = $routeParams.grupoId;


	vm.messages = [];
	/*
		messages = {
			msg : {
				emissor:
				date:
				content:
			},
			msg : {
				emissor:
				date:
				content:
			}

		}

		OU 

		messages = [] // array de strings
	*/
	vm.mensagem = { conteudo: {}, email: vm.loggedUser.sub, grupoId: vm.grupoId };

	socketio.on("messages", 
		function(data){
				console.log("novas mensagens");
				//console.log(data);
				vm.messages = splitMessage(data.all);
		});


	function splitMessage(msg){
		return msg.split(';');
	}

	vm.sendMessage = function(){
		
		vm.mensagem.email = vm.loggedUser.sub;
		vm.mensagem.grupoId = vm.grupoId;

		$http.post('/api/enviarMensagem', vm.mensagem)
		.success(function(resp){
			vm.mensagem.conteudo = '';
			socketio.on("MESSAGE_SENDED", function(data){
				console.log("mensagem enviada!");
			});
		});

	};

	vm.doLogout = function(){
		Auth.logout();
		
	};



});