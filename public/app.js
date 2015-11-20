var mainAppModName = 'mean';

var mainAppModule = angular.module(mainAppModName, ['ngRoute', 'users', 'example']);

mainAppModule.config(['$locationProvider', 
	function($locationProvider){
		$locationProvider.hashPrefix('!');
		/*
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
*/
	}
]);

if(window.location.hash === '#_=_') window.location.hash='#!';

angular.element(document).ready(function(){
	angular.bootstrap(document, [mainAppModName]);
});