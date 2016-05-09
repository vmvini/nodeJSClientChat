angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
	
	$routeProvider

		.when('/', {
			templateUrl: 'app/views/pages/main.html',
			controller: 'MainController',
			controllerAs:'mainCtrl'
		})

		.when('/me', {
			templateUrl: 'app/views/pages/me.html',
			controller: 'MeController',
			controllerAs:'meCtrl'
		})

		.when('/grupo/:grupoId', {
			templateUrl: 'app/views/pages/grupo.html',
			controller: 'GrupoController',
			controllerAs: 'grupoCtrl'
		});
	

	$locationProvider.html5Mode(true);

});
