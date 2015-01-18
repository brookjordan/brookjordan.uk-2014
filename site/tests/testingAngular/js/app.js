

var ttvApp = angular.module( 'ttvApp', ['ngRoute'] );



ttvApp.config(function ($routeProvider) {

	$routeProvider.

		when('/matches/:date', {
			controller:		'schedule',
			templateUrl:	'templates/schedule.html'
		}).

		otherwise({
			redirectTo:	'/matches/schedule'
		});

});


