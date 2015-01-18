//	mspt	=>	Milliseconds	/	tick
//	tps		=>	Ticks			/	second
//	spt		=>	Seconds			/	tick

window.BJ	=	window.BJ	||	{};

(function(){

	//	Function returned as 'add'
	function addRepeater ( func, options ) {
		var repeater		=	{},
				o			=	options	||	{},
				tickFunc	=	func	||	function(){},

				mspt	=	o.mspt	?	o.mspt	:
							o.tps	?	1000/o.tps :
							o.spt	?	o.spt/1000 :
							-1,

				namespace	=	o.namespace	||	null;

		repeater.mspt		=	mspt;
		repeater.func		=	tickFunc;
		repeater.tick		=	+new Date();
		repeater.isrunning	=	true;
		repeater.namespace	=	namespace;

		repeaters.push( repeater );
	}

	//	Function returned as 'remove'
	function removeRepeater ( namespace ) {
		var i	= 0,
			repeater,
			foundRepeaters	=	[];

		for (; i<repeaters.length; i+=1 ) {
			repeater	= repeaters[i];

			if ( repeater.namespace	=== namespace ) {
				foundRepeaters.push( repeaters.splice( i, 1 ) );
			}
		}

		return foundRepeaters;
	}

	//	Function returned as 'pause'
	//	If no namespace is passed, the global ticker will pause.
	//
	//	If a namespace is passed, only tickers under this namespace will pause.
	//	If the global tick is paused, resuming a namespace will not cause it to become active.
	function pauseRepeaters ( namespace ) {
		var i;

		if ( typeof namespace !== 'undefined' ) {
			for ( i=0; i<repeaters.length; i+=1 ) {
				repeater	= repeaters[i];

				if ( repeater.namespace	=== namespace ) {
					repeater.isrunning	=	false;
				}
			}

		} else if ( repeatAtAnimationFrame ) {
			cancelAnimationFrame( repeatAtAnimationFrame );
			repeatAtAnimationFrame	=	false;
		}
	}

	//	Function returned as 'resume'
	//	If no namespace is passed, the global tick will be resumed, if paused
	//
	//	If a namespace is passed, then this namespace will be resumed, if paused
	//	However, if the global ticker has been paused, this ticker will also remain paused
	//	It will resume once the global ticker is resumed.
	function resumeRepeaters ( namespace ) {
		var i;

		if ( typeof namespace !== 'undefined' ) {
			for ( i=0; i<repeaters.length; i+=1 ) {
				repeater	= repeaters[i];

				if ( repeater.namespace	=== namespace ) {
					repeater.tick	=	+new Date();
					repeater.isrunning	=	true;
				}
			}

		} else if ( !repeatAtAnimationFrame ) {
			for (i=0; i<repeaters.length; i+=1 ) {
				repeater	= repeaters[i];

				repeater.tick	=	+new Date();
			}

			repeatAtAnimationFrame	=	true;
			runRepeaters();
		}
	}

	//	Runs every monitor frame.
	//	Each repeater will then be ran the number of times required to appear to be running at the required frames per second
	function runRepeaters () {
		var i		=	0,
			j,
			dte		=	+new Date(),
			repeater;

		for (; i<repeaters.length; i+=1 ) {
			repeater	=	repeaters[i];

			if ( repeater.isrunning ) {
				j	=	repeater.mspt	===	-1	?	1 :
						Math.floor( (dte - repeater.tick) / repeater.mspt );

				for (; j>0; j-=1 ) {
					repeater.tick	+=	repeater.mspt;
					repeater.func();
				}
			}
		}

		//	Need to add a shiv for this at some point...
		repeatAtAnimationFrame	=	requestAnimationFrame( runRepeaters );
	}

	//	Repeaters are stored here
	var repeaters				=	[],
		repeatAtAnimationFrame	=	false;

	//	Initial run.
	//	It will then run itself.
	runRepeaters();



	BJ.repeater = {
		add:	addRepeater,
		remove:	removeRepeater,
		pause:	pauseRepeaters,
		resume:	resumeRepeaters,
		_get:	function(){return repeaters;}	// remove this for security
	};

}());