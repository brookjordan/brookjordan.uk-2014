(function(){

var tE = document.querySelector('.t');

var HoursTensElt = document.querySelector('.h1');
var HoursUnitsElt = document.querySelector('.h2');
var MinsTensElt = document.querySelector('.m1');
var MinsUnitsElt = document.querySelector('.m2');
var SecondsTensElt = document.querySelector('.s1');
var SecondsUnitsElt = document.querySelector('.s2');

var DateElt = document.querySelector('.date');
var MonthElt = document.querySelector('.month');
var YearElt = document.querySelector('.year');

var TimeBGElt = document.querySelector('.timebg');
var DateBGElt = document.querySelector('.datebg');

var timeHexElt = document.querySelector('.v1');
var timeAdjustedHexElt = document.querySelector('.v2');
var dateHexElt = document.querySelector('.v11');
var dateAdjustedHexElt = document.querySelector('.v22');

var bS = document.body.style;

var currentTime;

var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

updateDisplay();


//	//	//	//	///	//	//	//	//


function pad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function updateDisplay () {
	currentTime = getTimeParts();
	var time = getTime();
	var date = getDate();

	//	Background colours
	TimeBGElt.style.background = '#' + time.hex.adjusted;
	DateBGElt.style.background = 'linear-gradient(-15deg,' +
		'rgb(' + date.rgb.r + ',' + date.rgb.g + ',' + date.rgb.b + '),' +
		'rgba(' + date.rgb.r + ',' + date.rgb.g + ',' + date.rgb.b + ',' + 0 + ')' +
	')';

	//	Text colour
	if ( time.rgb.r + time.rgb.g + time.rgb.b + date.rgb.r + date.rgb.g + date.rgb.b < 255*3 ) {
		tE.className = 't tr';
	} else {
		tE.className = 't';
	}

	//	Hex values
	timeHexElt.innerHTML = '#' + time.hex.real;
	timeAdjustedHexElt.innerHTML = '#' + time.hex.adjusted.toUpperCase();

	dateHexElt.innerHTML = '#' + date.hex.real;
	dateAdjustedHexElt.innerHTML = '#' + date.hex.adjusted.toUpperCase();

	document.title = 'Colour clock | #' + time.hex.real;



	setTimeout( updateDisplay, 50 );
}

function getTimeParts () {
	var t = new Date();

	return {
		Y: t.getFullYear() % 100,
		M: t.getMonth(),
		d: t.getDate(),
		H: t.getHours(),
		m: t.getMinutes(),
		s: t.getSeconds()
	}
}

function getTime () {
	var H = pad( currentTime.H, 2 );
	var m = pad( currentTime.m, 2 );
	var s = pad( currentTime.s, 2 );

	var hex = getRGB( H, 23, m, 59, s, 59 );
	var rgb = hex2rgb( hex.adjusted );

	HoursTensElt.innerHTML = pad( H, 2 ).split('')[0];
	HoursUnitsElt.innerHTML = pad( H, 2 ).split('')[1];
	MinsTensElt.innerHTML = pad( m, 2 ).split('')[0];
	MinsUnitsElt.innerHTML = pad( m, 2 ).split('')[1];
	SecondsTensElt.innerHTML = pad( s, 2 ).split('')[0];
	SecondsUnitsElt.innerHTML = pad( s, 2 ).split('')[1];

	return {
		hex: hex,
		rgb: rgb
	}

}

function getDate () {
	var Y = currentTime.Y;
	var M = currentTime.M;
	var d = currentTime.d;

	var hex = getRGB( Y, 99, M, 10, d, 31 );
	var rgb = hex2rgb( hex.adjusted );

	YearElt.innerHTML  = Y;
	MonthElt.innerHTML = months[M];
	DateElt.innerHTML   = d;

	return {
		hex: hex,
		rgb: rgb
	}
}

function getRGB ( rC, rM, gC, gM, bC, bM ) { //	Current and Max

	var rD = ( Math.round( rC/rM*255 ) );
	var gD = ( Math.round( gC/gM*255 ) );
	var bD = ( Math.round( bC/bM*255 ) );

	var rR = pad( rC.toString( 16 ), 2 );
	var gR = pad( gC.toString( 16 ), 2 );
	var bR = pad( bC.toString( 16 ), 2 );

	var rH = pad( rD.toString( 16 ), 2 );
	var gH = pad( gD.toString( 16 ), 2 );
	var bH = pad( bD.toString( 16 ), 2 );

	var realHex = pad( rC, 2 ) + pad(gC,2) + pad(bC,2);
	var adjustedHex = rH + gH + bH;

	return {
		real: realHex,
		adjusted: adjustedHex
	}

}

function hex2rgb ( hex ) {
	return {
		r: parseInt( hex.substr( 0, 2 ), 16 ),
		g: parseInt( hex.substr( 2, 2 ), 16 ),
		b: parseInt( hex.substr( 4, 2 ), 16 )
	}
}

}());