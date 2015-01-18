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
	//ctx.clearRect( 0, 0, htmlI, htmlI );

	thisFrame	= +new Date();
	cFPS		= (( 1000/( thisFrame - prevFrame ) + cFPS*4 )/5) || cFPS;
	prevFrame	= thisFrame;


	renderBackground();
	renderHero();
	renderBlocks();

}

function renderBackground () {
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect( 0, 0, cnvI, cnvI );

}

function renderHero () {
	var x	= px( hero.posx - hero.w/2 ),
		y	= px( hero.posy - hero.h/2 );

	ctx.drawImage( hero.image, x, y );
}

function renderBlocks () {
	var i	= 0;

	$.each( blocks, function( i ){
		var blockElt	= $blocks[i],
			block		= this,

			x			= px( block.posx ),
			w			= px( block.w ),

			ht			= px( block.posy - block.gap/2 ),

			yb			= px( block.posy + block.gap/2 ),
			hb			= px( 100 - block.posy + block.gap/2 ),

			bh			= ( 900/(100*( block.gap/2 ) ) )*cnvI;

		ctx.fillStyle = "rgba(0,0,255,0.05)";
		ctx.fillRect( x, 0,  w, ht );
		ctx.fillRect( x, yb, w, hb );

		ctx.drawImage( img_bubbles, (100*block.bgFrame)%2100, 0, 100, 900, x, ht-bh,  w, bh );
		ctx.drawImage( img_bubbles, (100*block.bgFrame)%2100, 0, 100, 900, x, yb,     w, bh );
	});

}

function px ( percent, ceil ) {
	var pxSize	= (cnvI/100)*percent;

	ceil	= ceil || false;
	if ( ceil ) {
		pxSize = Math.ceil( pxSize );
	}

	return pxSize;
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
		simBlocksAndCollision();
		if ( backgroundShouldMove ) {
			simBackground();
		}
	}

	global.prevSim	= timeNow - timeLeft;

}

function simHero () {
	hero.spdy	= ( hero.spdy + (heroIsBoosting ? -hero.boost : global.gravity) )*global.resistance;
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
		var block	= this;

		block.frame	+= 1;
		if ( block.frame%2 === 0 ) {
			block.bgFrame	+= 1;
		}

		if ( blocksShouldMove ) {

			if ( block.init ) {
				block.posx -= blockDetails.spdx;

				if ( block.posx < -block.w ) {
					block.regen();
				}

			} else if ( blocks[ i-1 ].posx < block.initpoint ) {
				block.posx	= blocks[ i-1 ].posx + block.dist;
				block.init	= true;

			}

			if ( hero.posx+hero.w/2 > block.posx  &&  hero.posx-hero.w/2 < block.posx+block.w ) {
				close	= true;

				if ( hero.bottom() > block.bottom()  ||  hero.top() < block.top() ) {
					collide	= true;

				}
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
		useOptions = 1;
		$body.on( 'mousedown.reinit keydown.reinit touchstart.reinit', reinitialise );
	}, 1000 );
}

function boostUp ( e ) {

	e.preventDefault();
	if ( hero.boosttype === 'set' ) {
		hero.spdy = -hero.boost;

	} else if ( hero.boosttype === 'add' ) {
		addBoost();

	} else if ( hero.boosttype === 'hold' ) {
		heroIsBoosting	= true;
		$body.on( 'mouseup keyup touchend', function(){
			heroIsBoosting	= false;
		});

	}
}

function addBoost () {
	hero.spdy -= hero.boost;
}

function randomBlockY ( gap, pad ) {
	var randomHeight	= Math.random()*(100-pad) + pad/2; // random height between min and max
	//var randomHeight	= Math.random()>0.5 ? (100-pad) + pad/2 : pad/2; // only min and max heights
	return randomHeight;

}

function initSim () {
	$body.off( '.initSim' );

	heroShouldMove		= true;
	blocksShouldMove	= true;
}

function setHero () {
	hero.posx		= o.h.posx;
	hero.posy		= o.h.posy;

	hero.spdx		= o.h.spdx;
	hero.spdy		= o.h.spdy;

	hero.boost		= o.h.boost;
	hero.boosttype	= o.h.boosttype;

	hero.h			= o.h.h;
	hero.w			= o.h.w;

	hero.image		= o.h.image;
	hero.state		= 'main';

}

function Block () {
	this.gap	= blockDetails.gap;
	this.pad	= blockDetails.pad;

	this.w		= blockDetails.w;
	this.h		= 50 - this.gap/4;

	this.top	= function(){ return this.posy - this.gap/2; };
	this.bottom	= function(){ return this.posy + this.gap/2; };
	this.left	= function(){ return this.posx; };
	this.right	= function(){ return this.posx + this.w; };

	this.init	= !blocks.length;
	this.frame		= 0;
	this.bgFrame	= Math.floor( Math.random()*1000 );

	this.dist		= ((100+this.w*2)/blockDetails.count);
	this.initpoint	= ((100+this.w*2)/blockDetails.count)*(blockDetails.count);

	this.regen		= function(){
		this.posx	= 100 + this.w;
		this.posy	= randomBlockY( this.gap, this.pad );
		this.type	= Math.floor(Math.random()*blockDetails.types.length);
	};

	this.regen();
	this.posx	= blockDetails.start + blockDetails.w + 100;

}

function setBlocks () {

	var i = blockDetails.count;
	blocks = [];
	$blocks	= $('.block');

	if ( $blocks.length ) {
		$blocks.remove();
	}

	for (; i>0; i-=1 ) {
		blocks.push( new Block() );
	}

	$blocks	= $('.block');

}

function startup () {
	var	$html		= $('html'),
		$wrapper	= $('#wrapper'),
		$canvas		= $('<canvas/>');

	img_bubbles		= new Image();
	img_bubbles.src	= 'i/bubbles.png';

	htmlW	= $html.outerWidth();
	htmlH	= $html.outerHeight();
	htmlI	= Math.min( htmlW, htmlH );
	cnvI	= window.devicePixelRatio  ?
		htmlI*window.devicePixelRatio  :
		htmlI;

	$body.css({
		width:	htmlI + 'px',
		height:	htmlI + 'px',
		left:	(htmlW-htmlI)/2 + 'px',
		top:	(htmlH-htmlI)/2 + 'px'
	});

	// Build the canvas
	$canvas.attr( 'width', cnvI );
	$canvas.attr( 'height', cnvI );
	$canvas.css({
		position:	'absolute',
		top:		0,
		left:		0,
		width:		htmlI + 'px',
		height:		htmlI + 'px'
	});
	$wrapper.prepend($canvas);

	// Set public canvas
	canvas	= $canvas[0];
	ctx		= canvas.getContext('2d');
	//ctx.imageSmoothingEnabled= false;


	loadImages( commenceGame );

}

function loadImages ( callback ) {
	function loadImage ( option ) {
		return function ( e ) {
			loadersLeft-=1;

			var aCanvas		= document.createElement( 'canvas' ),
				aCtx		= aCanvas.getContext( '2d' ),
				aImg		= this,

				w			= px(option.hero.w),
				h			= px(option.hero.h);

			aCanvas.width	= Math.ceil( w );
			aCanvas.height	= Math.ceil( h );

			aCtx.imageSmoothingEnabled	= option.hero.aliased  ? false : true;
			aCtx.drawImage( aImg, 0, 0, w, h );
			option.hero.image	= aCanvas;

			if ( loadersLeft === 0 ) {
				commenceGame();
			}
		};
	}


	var heroList	= options.heroes,
		loadersLeft	= options.heroes.length;


	$.each( heroList, function(){
		this.hero.imageInit			= new Image();
		this.hero.imageInit.onload	= loadImage( this );
		this.hero.imageInit.src		= this.hero.imageurl	|| 'i/hero.png';
	});

}

function commenceGame () {
	reinitialise();
	BJ.repeater.add( sim, {
		fps: 60
	});
	BJ.repeater.add( render, {
		fps: 30
	});

}

function reinitialise () {
	o = setOptions( Math.floor(Math.random()*options.heroes.length) );
	setBlockDetails();
	setGlobalDetails();

	$body.off( '.reinit' );
	setBlocks();
	setHero();
	renderHero();
	resetScore();
	$body.on( 'mousedown.initSim keydown.initSim touchstart.initSim', initSim );
	$body.on( 'mousedown.boostUp keydown.boostUp touchstart.boostUp', boostUp );

}

function setOptions ( set ) {
	var o	= options.heroes[set];

	return {
		h:	{
			posx:	orelse( o.hero.posx,	25 ),
			posy:	orelse( o.hero.posy,	35 ),

			spdx:	orelse( o.hero.spdx,	0 ),
			spdy:	orelse( o.hero.spdy,	0 ),

			boost:	orelse( o.hero.boost,	4 ),
			boosttype:	orelse( o.hero.boosttype,	'add' ),

			h:		orelse( o.hero.h,		6 ),
			w:		orelse( o.hero.w,		6 ),

			image:	orelse( o.hero.image,	null )
		},

		b:	{
			w:		orelse( o.block.w,		10 ),
			gap:	orelse( o.block.gap,	25 ),
			pad:	orelse( o.block.pad,	10 ),

			spdx:	orelse( o.block.spdx,	0.5 ),

			start:	orelse( o.block.start,	20 ),
			count:	orelse( o.block.count,	3 ),
			types:	orelse( o.block.types,	['green'] )

		},

		p:	{
			gravity:	orelse( o.physics.gravity,		0.15 ),
			resistance:	orelse( o.physics.resistance,	0.92 ),
			fps:		orelse( o.physics.fps,			60 ),
			rfps:		orelse( o.physics.rfps,			60 )
		}
	};
}

function setBlockDetails () {
	blockDetails.gap	= o.b.gap;
	blockDetails.pad	= o.b.pad;
	blockDetails.w		= o.b.w;
	blockDetails.start	= o.b.start;
	blockDetails.count	= o.b.count;
	blockDetails.spdx	= o.b.spdx;
	blockDetails.types	= o.b.types;

}

function setGlobalDetails () {
	global.gravity		= o.p.gravity;
	global.resistance	= o.p.resistance;
	global.fps			= o.p.fps;
}


// Initial settings
var useOptions	= 0,
	o			= setOptions(useOptions);


// Game variables
var	$body		= $(document.body),
	$blocks,
	canvas, ctx, img_hero, img_bubbles,

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

	blockDetails	= {},
	blocks	= [],

	global	= {
		score:		0,
		hiScore:	0,
		prevSim:	+new Date()
	},

	background	= {
		posx:	0,
		spdx:	-0.3
	},

	heroIsBoosting			= false,
	heroShouldMove			= false,
	blocksShouldMove		= false,
	backgroundShouldMove	= true,

	htmlW, htmlH, htmlI, cnvI,
	thisFrame	= +new Date(),
	prevFrame	= thisFrame,
	cFPS		= 0;

startup();


}