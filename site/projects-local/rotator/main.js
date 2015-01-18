(function(){
	function rotateRedByPosX (e) {
		redRotate	=	e.clientX*1.5;

	}

	function cssRotate ( value ) {
		var rotateString	=	'rotate(';

		rotateString += value;
		rotateString += 'deg)';

		return rotateString;
	}

	function easeEasers () {
		greenRotate	+=	BJ.closestRotation( greenRotate, redRotate, true )/4;
		blueRotate	+=	BJ.closestRotation( blueRotate, greenRotate, true )/4;
	}

	function renderBalls () {
		easeEasers();

		redBall.style.WebkitTransform	=	cssRotate( redRotate );
		greenBall.style.WebkitTransform	=	cssRotate( greenRotate );
		blueBall.style.WebkitTransform	=	cssRotate( blueRotate );
	}



	var redBall		=	document.querySelector( '.rotatorUser' ),
		greenBall	=	document.querySelector( '.rotatorEase' ),
		blueBall	=	document.querySelector( '.rotatorFinal' ),

		redRotate	=	0,
		greenRotate	=	0,
		blueRotate	=	0;

	//document.addEventListener( 'mouseenter', rotateRedByPosX, false );
	document.addEventListener( 'mousemove', rotateRedByPosX, false );
	BJ.repeater.add( renderBalls, {
		tps:		30,
		namespace:	'rotationEasing'
	});

}());