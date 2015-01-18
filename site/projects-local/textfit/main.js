(function ( $, undefined ) {

	function fitItem ( elt, inc ) {

		function fitTick() {
			if ( setting  &&  cont.width() > elt.width() ) {
				i += inc;
				elt.css( 'font-size', i + 'em' );

				if ( cont.width() > elt.width() ) {
					fitTick();
				} else {
					i -= inc;
					elt.css( 'font-size', (i) + 'em' );
					setting = false;
				}

			} else if ( i > inc ) {
				i -= inc;

				if ( i === 0 ) {
					i = inc;
					elt.css( 'font-size', i + 'em' );
					setting = false;

				} else {
					elt.css( 'font-size', i + 'em' );

					if ( cont.width() > elt.width() ) {
						setting = false;
					} else {
						fitTick();
					}

				}

			}

		}



		var cont	= elt.parent(),

			inc		= inc || 0.2,
			i		= inc,
			setting	= true,
			tt;



		if ( usedElts.filter( elt ).length === 0 ) {

			usedElts = usedElts.add( elt );

			elt
				.addClass( 'inline-block' )
				.css( 'font-size', inc + 'em' );

			resizeFuncs.push(function() {
				clearTimeout( tt );
				setting = true;
				fitTick();
			});

			fitTick();

		} else {
			console.log( 'DON"T DO IT!!' );

		}
	}

	function restartTicks() {
		for ( var i=0; i<resizeFuncs.length; i+=1 ) {
			resizeFuncs[i]();
		}
 	}



	var resizeFuncs = [],
		usedElts	= $([]);

	$.fitText = function ( selector, inc ) {
		var inc = inc || 0.2;
		$(selector).each(function(){
			fitItem( $(this), inc );
		});
	};

	$(window).on( 'resize', restartTicks );

}(jQuery));