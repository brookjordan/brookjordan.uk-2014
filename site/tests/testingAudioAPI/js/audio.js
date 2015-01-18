var sounds = function(){

function init() {
	var createSound = document.createElement('button');

	logg( 'Attempting to create an audio context...', 1 );

	try {
		// Fix up for prefixing
		window.AudioContext		=	window.AudioContext || window.webkitAudioContext;
		audioCtx				=	new AudioContext();
		logg( 'Context created.', 2 );

		createSound = document.createElement('button');
		createSound.addEventListener( 'click', function(){
			loadAudioFile( prompt( 'Sound URL:', 'sounds/HJ.mp3' ) );
		}, false );
		createSound.innerHTML	=	'Create a sound buffer.';

		document.body.appendChild( createSound );

	} catch(e) {
		logg( 'Web Audio API is not supported in this browser.', 3 );
	}

}



function loadAudioFile ( url ) {
	logg( 'Loading the audio file at "' + url + '"...', 1 );

	var request		=	new XMLHttpRequest();
	request.open( 'GET', url, true );
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onreadystatechange = checkIfSoundFileIsReady;

	request.send();

}



function checkIfSoundFileIsReady ( e ) {
	if ( this.readyState === 4 ) {
		if ( this.status === 200 ) {
			logg( 'Sound loaded.', 2 );
			logg( 'Starting sound decode...', 1 );

			audioCtx.decodeAudioData( this.response, saveSoundAndCreatePlayButton, onSoundDecodeError	);

		} else {
			logg( 'Sound file errored.', 3 );
		}

	}

}



function saveSoundAndCreatePlayButton ( buffer ) {
	var playSound = document.createElement('button');

	loadedBuffers.push( buffer );
	playSound.addEventListener( 'click', createABufferSource, false );
	playSound.innerHTML	=	'Add sound layer.';

	logg( 'Audio decoded.', 2 );
	document.body.appendChild( playSound );

}



function onSoundDecodeError ( buffer ) {
	logg( 'Audio decoding failed.', 3 );

}



// To be returned
function createABufferSource ( bufferIndex, playAfter__ms ) {
	var source;

	if ( loadedBuffers.length ) {
		source	=	audioCtx.createBufferSource();		// creates a sound source
		bufferSources.push( source );

		bufferIndex		=	typeof bufferIndex === 'number' ?
			bufferIndex	:
			Math.floor( Math.random()*loadedBuffers.length );
		playAfter__ms	=	playAfter__ms	||	0;

		source.buffer	=	loadedBuffers[ bufferIndex ];		// tell the source which sound to play
		source.connect( audioCtx.destination );					// connect the source to the context's destination (the speakers)
		source.start( playAfter__ms );							// play the source now
		// note: on older systems, may have to use deprecated noteOn(time);

	} else {
		logg( 'No buffers loaded yet. Hold on.', 3 );

	}
}

function getLoadedBuffers () {
	return loadedBuffers;
}

function getBufferSources () {
	return bufferSources;
}

function logg ( text, type ) {
	var classes = [
			'',
			'loading',
			'success',
			'error'
		],
		aLogg	=	document.createElement('p');

	aLogg.innerHTML	=	text;
	aLogg.className	=	classes[ type || 0 ];

	document.body.appendChild( aLogg );

}





var audioCtx,
	loadedBuffers	=	[],
	bufferSources	=	[];



document.body.innerHTML	= '';
window.addEventListener('load', init, false);



return {
	buffers:	getLoadedBuffers,
	sources:	getBufferSources,
	add:		createABufferSource
};

}();