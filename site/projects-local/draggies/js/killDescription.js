(function(){
	var description = document.querySelector('.description');

	document.body.addEventListener('mousedown', killDescription, false);
	document.body.addEventListener('touchstart', killDescription, false);

	function killDescription (e) {
		document.body.removeEventListener('mousedown', killDescription, false);
		document.body.removeEventListener('touchstart', killDescription, false);

		description.className = 'description description--dead';

		setTimeout(function(){
			description.parentNode.removeChild( description );
		}, 5000);
	}
}())