angular.module('MainControllerModule', [])

.controller('MainController', function(Auth, $rootScope, $location, $http, socketio){

	var vm = this;

	vm.reg_complete = false;

	vm.reg_error = false;

	vm.hasSubmited = false;

	//boolean que indica se usuario está logado ou não
	vm.loggedIn = Auth.isLoggedIn();

	//para cada requisição em alguma rota: verificar se ta logado
	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser() //Auth.getUser() retorna um HttpPromise que possui o metodo then()
			.then(function(data){
				vm.user = data.data;

			});

	}); // fim do $rootScope.$on()


	if(vm.loggedIn){
		console.log("indo para perfil");
		$location.path('/me');
	}
	else{
		console.log("ninguem logado");
	}

	vm.doRegist = function(){
		console.log("realizar cadastro");

		$http.post('/api/cadastrarUsuario', vm.new_user)
		.success(function(data){

			socketio.on("SUCCESS_USER_REGISTER", function(data){
				console.log("sucesso ao cadastrar usuario");
			});

			socketio.on("SERVER_CONNECTION_LOST", function(data){
				console.log("conexao com servidor caiu");
			})
		});

	}


	//METODO PARA REALIZAR LOGIN
	vm.doLogin = function(){
		console.log("função doLogin executando");
		vm.processing = true;

		vm.error = '';

		function successLogin(){
			vm.processing = false;
			console.log("sucesso no login");
			Auth.getUser()
					.then(function(data){
						console.log("data de getUser: ", data);
						vm.user = data.data;
						console.log(vm.user);
						$location.path('/me');
					});



		}

		function failLogin(){
			vm.processing = false;
			console.log("erro no login");
			vm.error = "erro de autenticaçao";
		}

		Auth.login(vm.loginData.email, vm.loginData.senha, successLogin, failLogin );
			

	} //fim vm.doLogin()



	vm.doLogout = function(){
		Auth.logout();
		
	}




});