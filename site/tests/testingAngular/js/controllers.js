

ttvApp.controller( 'schedule', function ( $scope, $http, $routeParams ) {

	var	currentMatchCount,
		buttonStates		=	{
			load	:	'Load matches.',
			loading	:	'Loading...',
			refresh	:	'Refresh matches.',
		},
		dayNames	=	[
			'Sunday',
			'Monday',
			'Tuesday',
			'Wenesday',
			'Thursday',
			'Friday',
			'Saturday'
		],
		daysSize	=	-7,
		today		=	new Date();

	$scope.tour	=	{
		active: 0
	};
	$scope.matches	=	{};
	$scope.days		=	[];

	for (; daysSize<0; daysSize+=1 ) {
		$scope.days.push({
			number:	daysSize,
			name:	dayNames[ new Date( +today + daysSize*24*60*60*1000 ).getDay() ]
		});
	}

	$scope.resetMatches	=	function () {

		$scope.matches.urlBase	=	'http://www.beta.tennistv.com/json/sop/detail/yi/auth/7f6d1db453151323af9708d97bc9691d/callback/JSON_CALLBACK';
		$scope.matches.date		=	$routeParams.date === 'schedule' ?	'/type/c' : '/type/m/on/' + $routeParams.date;
		$scope.matches.count	=	100;
		currentMatchCount		=	$scope.matches.count;

	};



	$scope.fetch = function () {

		$scope.loadOrRefresh	=	buttonStates.loading;
		currentMatchCount		=	$scope.matches.count;

		$http.jsonp( $scope.matches.urlBase + $scope.matches.date + '/size/' + $scope.matches.count ).

			success(function(data, status) {
				if ( !data.tournaments ) {
					data.tournaments	=	[{
						category:		'0'
					}];

				}
				$scope.tournaments		=	data.tournaments;
				$scope.loadOrRefresh	=	buttonStates.refresh;
			}).

			error(function(data, status) {});

	};

	$scope.buttonTextToLoad = function () {
		if ( $scope.matches.count === currentMatchCount ) {
			$scope.loadOrRefresh	=	buttonStates.refresh;

		} else {
			$scope.loadOrRefresh	=	buttonStates.load;
		}
	};


	$scope.resetMatches();
	$scope.loadOrRefresh	=	buttonStates.load;
	$scope.fetch();

});


ttvApp.controller( 'years', function ( $scope ) {
	$scope.setCurrentTournament = function( $index ){
		$scope.tour.active	=	$index;
	};
});


