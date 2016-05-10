angular.module('MyApp', ['authService','grupoModule','MainControllerModule', 'MeCtrlModule', 'appRoutes'])
.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
});