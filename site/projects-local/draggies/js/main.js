function buildDraggy ( options ) {

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

			curr.x = (curr.x*speed + xx)/(1+speed);
			curr.y = (curr.y*speed + yy)/(1+speed);

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
				elt.style.left = x + 'px';
				elt.style.top  = y + 'px';
			}
		}
		
	}


	function setMouse( e ) {
		XX = e.pageX - width/ 2;
		YY = e.pageY - height/2;
		
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
			document.body.appendChild( elts[i].elt );
		}, 18*j );
	}

	var o           = options || {},
	    images      = [],
		elts        = [],

		container   = o.container || document.body,
		imageDir    = o.images    || 'i',
		imagePrefix = o.prefix    || 'Head',
		imageSuffix = o.suffix    || '',
		imageStart  = o.start     || 1,
		imageEnd    = o.end       || 297,
		imagePad    = o.pad       || 3,

		speed     = o.speed     || 0.02,

		width     = o.width     || 100,
		height    = o.height    || 100,

		XX        = 0,
		YY        = 0,

		position  = 1,
		moveElt   = createMoveEltFunc();

	for ( var i=imageStart; i<imageEnd+1; i+=1 ) {
		images.push( imagePrefix + pad( i, imagePad, '0' ) + imageSuffix + '.png' );

	}

	for ( i=images.length-1; i>-1; i-=1 ) {
		var elt = document.createElement( 'div' );
		elt.style.width           = width + 'px';
		elt.style.height          = height + 'px';
		moveElt( elt, 0, 0 )
		elt.style.backgroundImage = 'url(' + imageDir + '/' + images[ i ] + ')';

		document.body.appendChild( elt );
		elts.push( {
			elt:  elt,
			x:    0,
			y:    0
		});

	}

	window.addEventListener( 'mousedown', allowDrag, false );
	window.addEventListener( 'mousedown', setMouse, false );
	window.addEventListener( 'dblclick', switchPosition, false );

	requestAnimationFrame( followMouse );

}