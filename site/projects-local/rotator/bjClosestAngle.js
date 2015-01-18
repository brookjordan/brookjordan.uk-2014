window.BJ	=	window.BJ	||	{};

(function(){
	function closestRotation ( angleFrom, angleTo, useDegrees ) {
		var	degrees			=	useDegrees ? 360 : Math.PI*2,

			degreesTo		=	angleTo - angleFrom,
			rotationsTo		=	degreesTo / degrees,
			minRotations	=	rotationsTo - Math.round( rotationsTo ),
			minDegreesTo	=	minRotations * degrees;

		return minDegreesTo;

	}

	BJ.closestRotation	=	closestRotation;

}());