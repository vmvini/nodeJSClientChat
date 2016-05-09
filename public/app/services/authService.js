angular.module('authService', [])
/*
{
	criar serviço de nome Auth através do método factory do angular
	$http é um modulo passado automaticamente pela injeção de dependencia do angular
	$q é um promise object do angular, tbm passado por injeção de dependencia do angular
	AuthToken é o nome da proxima fabrica que irei construir, tbm passado por injeção de dependencia
}
*/
.factory('Auth', function($http, $q, AuthToken, socketio, $location){

	var authFactory = {};

	authFactory.login = function(email, password, success_callback, fail_callback){

		
		return $http.post('/api/login', {

			email: email, 
			senha: password
			//o metodo $http.post() retorna um HttpPromise object.
			//PORÉM: HttpPromise.success ESTÁ DEPRECIADO!!!
		}).success(function(data){
				
			socketio.on('sessiontoken', function(data){
				AuthToken.setToken(data.token);
				success_callback();
			});

			socketio.on('AUTHENTICATION_ERROR', function(data){
				fail_callback();
			});

		} );
	}


	authFactory.logout = function(){
		
		$http.post('/api/logout',{})
		.success(function(){
			console.log("deslogou com sucesso");
			AuthToken.setToken();
			$location.path('/');

		});
		
	}

	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

	
	authFactory.getUser = function(){ //retorna um HttpPromise
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({message:"User has no token"});
	}

	return authFactory;

})


.factory('AuthToken', function($window){

	var authTokenFactory = {};

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){

		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');

	}

	return authTokenFactory;

})


//esse serviço serve para verificar em cada requisiçao se existe um token
.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptorFactory = {};

	interceptorFactory.request = function(config){
		var token = AuthToken.getToken();

		if(token){
			config.headers['x-access-token'] = token;
		}

		return config;
	}

	interceptorFactory.responseError = function(response){
		if(response.status == 403)
			$location.path('/');

		return $q.reject(response);
	}

	return interceptorFactory;

})

.factory('socketio', function($rootScope){

	var socket =  io.connect();

	return{
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.apply(function(){
					if(callback){
						callback.apply(socket,args);
					}
				});
			});
		}

	};

});