angular.module('MyApp', ['authService','MainControllerModule', 'MeCtrlModule', 'appRoutes'])
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
});