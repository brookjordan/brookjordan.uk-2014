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

				nmsp	=	o.namespace	||	null;

		repeater.mspt	=	mspt;
		repeater.func	=	tickFunc;
		repeater.tick	=	+new Date();
		repeater.nmsp	=	nmsp;

		repeaters.push( repeater );

	}

	//	Function returned as 'remove'
	function removeRepeater ( namespace ) {
		var i	= 0,
			repeater,
			foundRepeaters	=	[];

		for (; i<repeaters.length; i+=1 ) {
			repeater	= repeaters[i];

			if ( repeater.nmsp	=== namespace ) {
				foundRepeaters.push( repeaters.splice( i, 1 ) );
			}
		}

		return foundRepeaters;

	}

	//	Function returned as 'stop'
	function stopRepeaters ( namespace ) {
		if ( repeatAtAnimationFrame ) {
			cancelAnimationFrame( repeatAtAnimationFrame );
			repeatAtAnimationFrame	=	false;
		}

	}

	//	Runs every frame.
	//	Regulation happens here.
	function runRepeaters () {
		var i		=	0,
			j,
			dte		=	+new Date(),
			repeater;

		for (; i<repeaters.length; i+=1 ) {
				repeater	=	repeaters[i];
				j			=	repeater.mspt	===	-1	?	1 :
								Math.floor( (dte - repeater.tick) / repeater.mspt );

				for (; j>0; j-=1 ) {
					repeater.tick	+=	repeater.mspt;
					repeater.func();
				}

		}

		//	Need to add a shiv for this at some point...
		repeatAtAnimationFrame	=	requestAnimationFrame( runRepeaters );
	}

	//	Repeaters are stored here
	var repeaters	=	[],
		repeatAtAnimationFrame	=	false;

	//	Initial run.
	//	It will then run itself.
	runRepeaters();

	BJ.repeater = {
		add:	addRepeater,
		remove:	removeRepeater,
		stop:	stopRepeaters
	};

}());