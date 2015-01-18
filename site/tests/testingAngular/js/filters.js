

ttvApp.filter( 'orderRound', function() {
	return function( rounds ) {
		var filtered	= [],
			roundNames		=	[
				'qualifying',
				'round1',
				'round2',
				'round3',
				'round4',
				'quarterfinal',
				'semifinal',
				'final'
			];

		angular.forEach(rounds, function(round) {
			filtered.push(round);
		});

		filtered.sort(function (a, b) {
			return ( roundNames.indexOf( a.name.toLowerCase().replace(/[^A-Za-z0-9]/, '') ) > roundNames.indexOf( b.name.toLowerCase().replace(/[^A-Za-z0-9]/, '') ) );
		});

		return filtered;
	};
});



ttvApp.filter( 'orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];

		angular.forEach(items, function(item) {
			filtered.push(item);
		});

		filtered.sort(function (a, b) {
			return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
		});

		if(reverse){
			filtered.reverse();
		}

		return filtered;
	};
});


ttvApp.filter( 'check', function() {
	return function( items ) {
		console.log( arguments );
		return items;

	};
});




