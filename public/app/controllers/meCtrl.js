angular.module('MeCtrlModule', [])

.controller('MeController', function(Auth, $rootScope, $location, $http, socketio){

	var vm = this;

	Auth.getUser().then(function(resp){
		console.log("pegando usuario logado:");
		console.log(resp);
		vm.loggedUser = resp.data;
	});


	vm.doLogout = function(){
		Auth.logout();
		$location.path('/');
	}


	vm.inscrever = function(grupoId){

		var data = {
			email: vm.loggedUser.sub,
			grupoId: grupoId,
		};

		$http.post('/api/inscreverEmGrupo', data)
			.success(function(resp){
				socketio.on("SUCCESS_SIGNUP_GROUP", function(){
					console.log("sucesso ao cadastrar usuario");
				});
			});

	}

	
});
