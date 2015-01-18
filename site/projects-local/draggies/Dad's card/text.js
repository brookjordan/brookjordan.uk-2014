function createText () {
	var text = $('<p/>', {
			'html':  texts[ Math.floor( Math.random()*texts.length ) ],
			'class': 'text'
		});

	text.css({
		"font-size": Math.random()*0.6 + 0.8 + 'em',
		"color":     '#' + colours[ Math.floor( Math.random()*colours.length ) ]
	});

	body.append( text );
	var textHeight = text.height(),
		textWidth  = text.width(),
		bodyHeight = body.height(),
		bodyWidth  = body.width();
	text.hide();

	text.css({
		top:  Math.random()*( bodyHeight - textHeight ),
		left: Math.random()*( bodyWidth  - textWidth )
	});
	
	body.append( text );
	text.fadeIn( Math.floor( Math.random()*701 ) + 200 );
	setTimeout(function() {
		text.fadeOut( Math.floor( Math.random()*701 ) + 200, function(){ text.remove(); });
	}, 3000 );
}

var texts = [
		'I love you!',
		'Why the man?<br>cos it\'s Christmassy!',
		'Merry Christmas!',
		'Spending time with you<br>is one of my favourite<br>things to do.',
		'Try dragging the man around!',
		'Double click!<br>Double click!',
		'Love you loads, <small>and loads, <small>and loads, <small>and loads, <small>and loads...</small></small></small></small>',
		'I love you loads, <big>and loads, <big>and loads, <big>and loads, <big>and loads...</big></big></big></big>',
		'We still need to try playing<br>guitar together sometime.',
		'Having problems at work<br>and keeping a smile<br>AND<br>still being amazing...<br>\tcan\'t be easy.',
		'<small>Text...</small><br>Why\'re you moving...<br><big>Stahp!</big>',
		'You\'re always there for me.',
		'I love it when I can help<br>you with things.<br>Make sure I know when there\'s<br>something I can help with.',
		'Time...<br>it seems you control it.<br>You do so much and<br>still have time for us.',
		'I\'ve recently, more than before,<br>enjoyed some of our chats this year',
		'I even enjoy your friends\' company!',
		'I\'ve enjoyed going to galleries with you.<br>Maybe more often this year?',
		'On the way here?<small>\tNo...<small>\t\tNot again...</small></small>',
		'Living with you is just as<br>easy as it always has been.<br>Thanks for that.',
		'He kinda looks like you...',
		'The fact that I know my bed<br>sheets will be clean<br>when I get home is crazy...',
		'You give me a meal, house and bed<br><small>(almost)</small> every night?',
		Math.ceil( Math.random()*8 ) + '% battery!<big> More things to write!<big> Think!</big></big>',
		'I\'m not good at these.<br>I always say that...<br>But I love you.<br>Is there another way to say that?',
		'I love you!',
		'Love you I do!',
		'Brook loves Daddy!',
		'Love<small>love<small>love<small>love</small>love</small>love</small>',
		'Love<big>love<big>love<big>love</big>love</big>love</big>',
		'Love<small> love<small> love<small> love</small> love</small> love</small>',
		'Love<big> love<big> love<big> love</big> love</big> love</big>',
		'Try to collect all the words!',
		'Just so you know,<br>collecting words doesn\'t do anything',
		'Maybe I should add sound...<br>That could be annoying.'
	],
	colours = [
		'fffec9',
		'f9ea43',
		'e1ba1f',
		'd96221',
		'a82b2b',
		'7415ea',
	],
	body = $(document.body);

setInterval( createText, 800 );