/*
 *	hero: {
 *		posx:
 *		posy:
 *
 *		spdx:
 *		spdy:
 *
 *		boost:
 *
 *		h:
 *		w:
 *	},
 *
 *	block: {
 *		w:
 *		gap:
 *
 *		spdx:
 *
 *		start:
 *		count:
 *		types: [
 *
 *		]
 *	},
 *
 *	physics: {
 *		gravity:
 *		resistance:
 *		fps:
 *	}
 *
 */


function makeHeroGame ( options ) {

function orelse ( requested, result ) {
	if ( typeof requested === 'undefined' ) {
		return result;
	} else {
		return requested;
	}
}

function render () {
	if ( heroShouldMove ) {
		renderHero();
	}
	if ( blocksShouldMove ) {
		renderBlocks();
	}
	if ( backgroundShouldMove ) {
		renderBackground();
	}

	requestAnimationFrame( render, 30 );

}

function sim () {
	var spf			= 1000/global.fps,
		timeNow		= +new Date(),
		timeDiff	= timeNow-global.prevSim,
		sims		= Math.floor( timeDiff/spf ),
		timeLeft	= timeDiff - sims*spf;

	for (; sims>0; sims-=1 ){
		if ( heroShouldMove ) {
			simHero();
		}
		if ( blocksShouldMove ) {
			simBlocksAndCollision();
		}
		if ( backgroundShouldMove ) {
			simBackground();
		}
	}

	global.prevSim	= timeNow - timeLeft;

	setTimeout( sim, spf/2 );

}

function renderHero () {
	heroPx	= {
			posx:	(htmlI/100)*(hero.posx - hero.w/2),
			posy:	(htmlI/100)*(hero.posy - hero.h/2)
		};

	BJ.transformElt( $hero[0], heroPx.posx + 'px', heroPx.posy + 'px' );
	$hero.css({
			width:				hero.w	+ '%',
			height:				hero.h	+ '%'
		})
		.attr( 'data-state', hero.states[ hero.state ] );
}

function renderBlocks () {
	var i	= 0;

	$.each( blocks, function( i ){
		var self	= this.elt,
			block	= this,
			blockPx	= {
				posx:	(htmlI/100)*block.posx,
				posy:	(htmlI/100)*(block.posy-100)
			};

		BJ.transformElt( self, blockPx.posx + 'px', blockPx.posy + 'px' );

		$(self).children().css({
				//backgroundColor:	blockDetails.types[block.type].color,
				height:				block.h + '%'
			});
	});

}

function renderBackground () {
	$wrapper[0].style.backgroundPosition	= background.posx + '% 0';

}

function simHero () {
	hero.spdy	= (hero.spdy + global.gravity)*global.resistance;
	hero.posy	+= hero.spdy;

	if ( hero.posy > 100 - hero.h/2 ) {
		hero.posy = 100 - hero.h/2;
		killBird();

	} else if ( hero.posy < hero.h/2 ) {
		hero.posy = hero.h/2;
		hero.spdy	= Math.abs( hero.spdy );

	}

}

function simBlocksAndCollision () {
	var collide	= false,
		close	= false;

	$.each( blocks, function( i ){
		if ( this.init ) {
			this.posx -= blockDetails.spdx;

			if ( this.posx < -this.w ) {
				this.posx	= 100 + this.w;
				this.posy	= randomBlockY( blockDetails.gap );
				this.type	= Math.floor(Math.random()*blockDetails.types.length);
			}

		} else if ( blocks[ i-1 ].posx < this.initpoint ) {
			this.posx	= blocks[ i-1 ].posx + this.dist;
			this.init	= true;

		}

		if ( hero.posx+hero.w/2 > this.posx  &&  hero.posx-hero.w/2 < this.posx+this.w ) {
			close	= true;

			if ( hero.bottom() > this.bottom()  ||  hero.top() < this.top() ) {
				collide	= true;

			}
		}
	});


	if ( hero.state	!== 'dead' ) {
		if ( collide ) {
			killBird();

		} else if ( close ) {
			hero.state	= 'danger';

		} else {
			if ( hero.state === 'danger' ) {
				incScore();
			}
			hero.state	= 'main';

		}
	}

}

function incScore () {
	global.score += 1;
	printScore();

}

function resetScore () {
	global.hiScore	= Math.max( global.score, global.hiScore );
	global.score		= 0;
	printScore();

}

function printScore () {
	$('#score')[0].innerHTML = global.score;
	if ( global.hiScore !== 0 ) {
		$('#score')[0].innerHTML += ' <span class="hiScore">' + global.hiScore + '</span>';
	}

}

function simBackground () {
	background.posx += background.spdx;

}

function killBird () {
	$body.off( '.boostUp' );

	heroShouldMove	= false;
	blocksShouldMove		= false;
	hero.state		= 'dead';

	renderHero();

	setTimeout(function(){
		$body.on( 'mousedown.reinit keydown.reinit touchstart.reinit', reinitialise );
	}, 1000 );
}

function boostUp ( e ) {
	e.preventDefault();
	hero.spdy -= hero.boost;
}

function randomBlockY ( gap ) {
	var randomHeight	= Math.random()*(100-gap-10) + gap/2+5;
	return randomHeight;

}

function initSim () {
	$body.off( '.initSim' );

	heroShouldMove		= true;
	blocksShouldMove			= true;
}

function setHero () {
	hero.posx		= o.h.posx;
	hero.posy		= o.h.posy;

	hero.spdx		= o.h.spdx;
	hero.spdy		= o.h.spdy;

	hero.boost	= o.h.boost;

	hero.h		= o.h.h;
	hero.w		= o.h.w;

	hero.state	= 'main';

}

function buildBlock () {
	var $block		= $('<div/>').addClass('block item'),
		$blockTop	= $('<div/>').addClass('blockPart blockTop').appendTo( $block ),
		$blockBottom	= $('<div/>').addClass('blockPart blockBottom').appendTo( $block );

	$wrapper.append( $block );

}

function setBlocks () {

	var i = blockDetails.count;
	blocks = [];
	$blocks	= $('.block');

	if ( $blocks.length ) {
		$blocks.remove();
	}

	for (; i>0; i-=1 ) {
		buildBlock();
	}

	$blocks	= $('.block');

	$blocks.each(function( i ){

		var block	= {
			posx:	blockDetails.start + blockDetails.w + 100,
			posy:	randomBlockY(blockDetails.gap),
			type:	Math.floor(Math.random()*blockDetails.types.length),

			w:		blockDetails.w,
			h:		50 - blockDetails.gap/4,

			top:	function(){ return this.posy - blockDetails.gap/2; },
			bottom:	function(){ return this.posy + blockDetails.gap/2; },
			left:	function(){ return this.posx; },
			right:	function(){ return this.posx + this.w; },

			init:	i===0
		};

		$(this).addClass( 'blockType' + block.type );
		this.style.width	= block.w + '%';
		block.elt			= this;

		block.dist		= ((100+block.w*2)/$blocks.length);
		block.initpoint	= ((100+block.w*2)/$blocks.length)*($blocks.length-1);

		blocks.push(block);


	});

	for (; i>0; i-=1 ) {
		/*
		blocks.push( new Block );
		*/
	}

}

function reinitialise () {
	$body.off( '.reinit' );
	setBlocks();
	setHero();
	renderHero();
	resetScore();
	$body.on( 'mousedown.initSim keydown.initSim touchstart.initSim', initSim );
	$body.on( 'mousedown.boostUp keydown.boostUp touchstart.boostUp', boostUp );

}


// Initial settings
var o	= {

	h:	{
		posx:	orelse( options.hero.posx,	25 ),
		posy:	orelse( options.hero.posy,	35 ),

		spdx:	orelse( options.hero.spdx,	0 ),
		spdy:	orelse( options.hero.spdy,	0 ),

		boost:	orelse( options.hero.boost,	4 ),

		h:		orelse( options.hero.h,		6 ),
		w:		orelse( options.hero.w,		6 )
	},

	b:	{
		w:		orelse( options.block.w,		10 ),
		gap:	orelse( options.block.gap,		25 ),

		spdx:	orelse( options.block.spdx,		0.5 ),

		start:	orelse( options.block.start,	20 ),
		count:	orelse( options.block.count,	3 ),
		types:	orelse( options.block.types,	['green'] )

	},

	p:	{
		gravity:	orelse( options.physics.gravity,	0.15 ),
		resistance:	orelse( options.physics.resistance,	0.92 ),
		fps:		orelse( options.physics.fps,		60 )
	}

};


// Game variables
var	$body		= $(document.body),
	$wrapper	= $('#wrapper'),
	$html		= $('html'),
	$hero		= $('#hero'),
	$blocks,

	hero	= {
		top:	function(){ return this.posy - this.h/2; },
		bottom:	function(){ return this.posy + this.h/2; },
		left:	function(){ return this.posx - this.w/2; },
		right:	function(){ return this.posx + this.w/2; },

		states:	{
			main:	'main',
			danger:	'danger',
			dead:	'dead'
		}
	},

	blockDetails	= {
		gap:	o.b.gap,
		w:		o.b.w,
		start:	o.b.start,
		count:	o.b.count,
		spdx:	o.b.spdx,
		types:	o.b.types
	},
	blocks	= [],

	global	= {
		gravity:	o.p.gravity,
		resistance:	o.p.resistance,
		fps:		o.p.fps,
		score:		0,
		hiScore:	0,
		prevSim:	+new Date()
	},

	background	= {
		posx:	0,
		spdx:	-0.3
	},

	heroShouldMove			= false,
	blocksShouldMove		= false,
	backgroundShouldMove	= true,

	htmlW	= $html.outerWidth(),
	htmlH	= $html.outerHeight(),
	htmlI	= Math.min( htmlW, htmlH );


$body.css({
	width:	htmlI + 'px',
	height:	htmlI + 'px',
	left:	(htmlW-htmlI)/2 + 'px',
	top:	(htmlH-htmlI)/2 + 'px'
});

reinitialise();
sim();
render();

};