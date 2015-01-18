// START - SHIVS //
(function createRequestAnimFrame () {
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();
}());

(function createTransform2D () {
	var elt = document.body;

	if ( typeof elt.style.transform !== 'undefined' ) {
		transform2D = 'transform';
	} else if ( typeof elt.style.WebkitTransform !== 'undefined' ) {
		transform2D = 'WebkitTransform';
	} else if ( typeof elt.style.MozTransform !== 'undefined' ) {
		transform2D = 'MozTransform';
	} else {
		transform2D = null;
	}
}());
// END - SHIVS //



function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function followMouse( e ) {
	var curr, prevX, prevY;

	requestAnimationFrame( followMouse );

	for ( var i=elts.length-1; i>-1; i-=1 ) {
		if ( typeof prevX === 'undefined' ) {
			xx = XX;
			yy = YY;
		} else {
			xx = prevX;
			yy = prevY;
		}

		curr = elts[ i ];

		curr.x = (curr.x*0.2 + xx)/1.2;
		curr.y = (curr.y*0.2 + yy)/1.2;

		moveElt( curr.elt, curr.x, curr.y );

		prevX = curr.x;
		prevY = curr.y;
	}
}

function createMoveEltFunc () {
	if ( transform2D ) {
		return function ( elt, x, y ) {
			elt.style[ transform2D ] = 'translate(' + x + 'px,' + y +  'px)';
		}
	} else {
		return function ( elt, x, y ) {
			elt.style.left            = x + 'px';
			elt.style.top             = y + 'px';
		}
	}
	
}


function setMouse( e ) {
	XX = e.pageX-width/2;
	YY = e.pageY-height/2;
	
}

function allowDrag ( func ) {
	window.removeEventListener( 'mousedown', allowDrag, false );
	window.addEventListener( 'mouseup', stopDrag, false );
	window.addEventListener( 'mouseleave', stopDrag, false );
	
	window.addEventListener( 'mousemove', setMouse, false );
}

function stopDrag ( func ) {
	window.removeEventListener( 'mouseup', stopDrag, false );
	window.removeEventListener( 'mouseleave', stopDrag, false );
	window.removeEventListener( 'mousemove', setMouse, false );

	window.addEventListener( 'mousedown', allowDrag, false );
}

function switchPosition () {
	if ( position === 1 ) {
		rebuildFeetup();
	} else {
		rebuildHeadup();
	}
}

function rebuildHeadup () {
	for (var i=elts.length-1; i>-1; i-=1 ) {
		switchSoon( i, i );
	}
	position = 1;
}

function rebuildFeetup () {
	for (var i=0; i<elts.length; i+=1 ) {
		switchSoon( i, elts.length-i-1 );
	}
	position = 0;
}

function switchSoon( i, j ) {
	setTimeout( function(){
		$('.manholder').append( elts[i].elt );
	}, 18*j );
}

var images = [],
	elts   = [],

	width  = 360,
	height = 209,

	XX     = $(document.body).width()/2  - width/2,
	YY     = $(document.body).height()/2 - height/2,

	position = 1,
	moveElt = createMoveEltFunc();

for ( var i=1; i<94; i+=1 ) {
	images.push( '2512---00' + pad( i, 2, '0' ) + '.png' );

}

for ( i=images.length-1; i>-1; i-=1 ) {
	var elt = document.createElement( 'div' );
	elt.style.width           = width + 'px';
	elt.style.height          = height + 'px';
	moveElt( elt, 0, 0 )
	elt.style.backgroundImage = 'url(human/' + images[ i ] + ')';
	elt.className = 'manbit';

	$('.manholder').append( elt );
	elts.push( {
		elt:  elt,
		x:    $(document.body).width()/2  - width/2,
		y:    $(document.body).height()/2 - height/2
	});

}

window.addEventListener( 'mousedown', allowDrag, false );
window.addEventListener( 'mousedown', setMouse, false );
window.addEventListener( 'dblclick', switchPosition, false );

requestAnimationFrame( followMouse );