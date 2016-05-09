angular.module('MeCtrlModule', [])

.controller('MeController', function(Auth, $rootScope, $location){

	var vm = this;

	
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/');
	}



});
