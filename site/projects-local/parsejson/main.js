function parseJSON	( string, options ) {

	function ignore () {

	}

	function openObject () {
		finalString	+= DOM.printObject.before;
		finalString += openObjectChar;
		finalString	+= DOM.printObjectInner.before;

		inside.push('object');
		stateName	=	'opened an object';
	}

	function openArray () {
		finalString	+= DOM.printArray.before;
		finalString += openArrayChar;
		finalString	+= DOM.printArrayInner.before;

		inside.push('array');
		stateName	=	'opened an array';
	}

	function closeContainer () {
		var containerIsObject	=	insideObject(),
			correctTagUsed		=	false;

		if ( containerIsObject ) {
			if ( char === '}' ) {
				finalString	+=	DOM.printObjectInner.after;
				finalString	+=	closeObjectChar;
				finalString	+=	DOM.printObject.after;
				correctTagUsed	=	true;

			} else {
				printError( ' - Wrong closing tag. Requires: }' );
			}

		} else {
			if ( char === ']' ) {
				finalString	+=	DOM.printArrayInner.after;
				finalString	+=	closeArrayChar;
				finalString	+=	DOM.printArray.after;
				correctTagUsed	=	true;

			} else {
				printError( ' - Wrong closing tag. Requires: ]' );
			}
		}

		if ( correctTagUsed ) {
			inside.pop();
			if ( inside.length ) {
				stateName	=	'just ended a value';

			} else {
				endJSON();
			}
		}
	}

	function openLabel () {
		finalString	+= DOM.printLabel.before;
		finalString += labelQuote;
		finalString	+= DOM.printLabelInner.before;

		inside.push('label');
		stateName	=	'printing label';
	}

	function closeLabel () {
		finalString	+= DOM.printLabel.after;
		finalString += labelQuote;
		finalString	+= DOM.printLabelInner.after;

		inside.pop();
		stateName	=	'waiting for colon';
	}

	function openString () {
		finalString += DOM.printString.before;
		finalString += stringQuote;
		finalString += DOM.printStringInner.before;

		inside.push('string');
		stateName	=	'printing string';
	}

	function closeString () {
		finalString += DOM.printStringInner.after;
		finalString += stringQuote;
		finalString += DOM.printString.after;

		inside.pop();
		stateName	=	'just ended a value';
	}

	function openEscape () {
		finalString += DOM.printEscape.before;
		finalString += '\\';
		finalString += DOM.printEscape.after;

		stateName	=	'printing escape';
	}

	function openNumber () {
		inside.push('number');

		finalString += DOM.printNumber.before;

		if ( charTypes.number.test( char ) ) {
			printInteger();

		} else if ( charTypes.sign.test( char ) ) {
			printSign();

		} else if ( charTypes.decimal.test( char ) ) {
			openDecimal();

		} else if ( charTypes.e.test( char ) ) {
			printExponent();
		}
	}

	function closeNumber () {
		inside.pop();

		finalString += DOM.printNumber.after;

		if ( charTypes.closeContainer.test( char ) ) {
			closeContainer();

		} else if ( charTypes.comma.test( char ) ) {
			startNextValue();

		} else if ( charTypes.space.test( char ) ) {
			stateName	=	'just ended a value';
		}
	}

	function printSign () {
		if ( char === '-' ) {
			finalString += '-' ;
		} else {
			finalString += '+';
		}

		stateName	=	'starting number';
	}

	function openDecimal () {
		finalString += DOM.printDecimal.before;
		finalString += '.';
		finalString += DOM.printDecimal.after;

		stateName	=	'printing decimal';
	}

	function printExponent () {
		finalString += 'e';

		stateName	=	'printing exponent';
	}

	function printTrue () {
		finalString += DOM.printTrue.before;
		inside.push('true');
		startSpecial();
	}

	function printFalse () {
		finalString += DOM.printFalse.before;
		inside.push('false');
		startSpecial();
	}

	function printNull () {
		finalString += DOM.printNull.before;
		inside.push('null');
		startSpecial();
	}

	function startSpecial () {
		printingLetters	=	curentlyInside().split('').reverse();
		stateName		=	'printing special';

		printSpecial();
	}

	function printSpecial () {
		var requiredLetter	=	printingLetters.pop();

		if ( char === requiredLetter ) {
			finalString += char;

			if ( printingLetters.length === 0 ) {
				switch ( curentlyInside() ) {
					case 'true':
						finalString += DOM.printTrue.after;
						break;
					case 'false':
						finalString += DOM.printFalse.after;
						break;
					case 'null':
						finalString += DOM.printNull.after;
						break;
				}
				inside.pop();
				stateName	=	'just ended a value';
			}

		} else {
			printError( ' - Wrong next character to spell ' + curentlyInside() + '. Requires: ' + requiredLetter );

		}
	}

	function printCharacter () {
		finalString += char;

		stateName	=	'printing ' + curentlyInside();
	}

	function printInteger () {
		finalString += char;

		stateName	=	'printing integer';
	}

	function printDecimal () {
		finalString += char;

		stateName	=	'printing decimal';
	}

	function startNextValue () {
		if ( !insideContainer() ) {
			//console.log(curentlyInside());
			inside.pop();
		}

		finalString += DOM.printComma.before;
		finalString += ',';
		finalString += DOM.printComma.after;

		if ( insideObject() ) {
			stateName	=	'waiting for label';
		} else {
			stateName	=	'waiting for value';
		}
	}

	function printDividerColon () {
		finalString += DOM.printDividerColon.before;
		finalString += colonChar;
		finalString += DOM.printDividerColon.after;

		stateName	=	'waiting for value';
	}

	function printError ( message ) {
		finalString	+=	DOM.printError.before;
		finalString	+=	message;
		finalString	+=	DOM.printError.after;
		//throw( message );
		splitString	=	[];
	}





	function endJSON () {
		stateName	=	'done.';
	}

	function insideObject () {
		return	inside[ inside.length-1 ] === 'object';
	}

	function insideContainer () {
		return	inside[ inside.length-1 ] === 'object'  ||  inside[ inside.length-1 ] === 'array';
	}

	function insideLabel () {
		return	inside[ inside.length-1 ] === 'label';
	}

	function curentlyInside () {
		return	inside[ inside.length-1 ];
	}

	function wasExpecting ( allows ) {
		var i			=	0,
			allowsArray	=	[];

		for (; i<allows.length; i+=1 ) {
			allowsArray.push( allows[i].name );
		}

		return allowsArray;
	}

	function fallbackTo ( prefered, fallback ) {
		var toUse	=	typeof prefered !== 'undefined'  &&  prefered !== null ?
				prefered :
				fallback;

		return toUse;
	}





	function loopSequence () {
		char		=	splitString.pop()  ||  '';

		//console.log( 'Status: ' + stateName);
		var state	=	states[ stateName ],
			allows	=	state.allows,
			found,
			testReg,
			i		=	0,
			doneSomething	=	false;

		//console.log(allows);
		for (; i<allows.length; i+=1 ) {
			found	=	allows[ i ];
			testReg	=	charTypes[ found.name ];
			//console.log(found);
			//console.log(testReg);

			if ( testReg.test( char ) ) {
				found.method();
				doneSomething	=	true;

				//console.log( 'Found: ' + found.name + ' - ' + char );
				break;
			}
		}

		if ( !doneSomething  &&  stateName !== 'done.' ) {
			printError( ' - Was expecting one of: "' + wasExpecting(allows).join('", "') + '"\nBut found: "' + char + '"\nFollowing: ' + previousChars.join('') );
		}
	}







	var o	=	options || {},

		DOM	=	{
			container			:	{
				before:	fallbackTo( o.beforeStart, '' ),
				after:	fallbackTo( o.afterFinish, '' )
			},
			ignore				:	{
				before:	fallbackTo( o.beforeIgnore, '' ),
				after:	fallbackTo( o.afterIgnore, '' )
			},
			printObject			:	{
				before:	fallbackTo( o.beforeOpeningObject, '' ),
				after:	fallbackTo( o.afterClosingObject, '' )
			},
			printObjectInner	:	{
				before:	fallbackTo( o.beforePrintingObject, '' ),
				after:	fallbackTo( o.afterPrintingObject, '' )
			},
			printArray			:	{
				before:	fallbackTo( o.beforeOpeningArray, '' ),
				after:	fallbackTo( o.afterClosingArray, '' )
			},
			printArrayInner		:	{
				before:	fallbackTo( o.beforePrintingArray, '' ),
				after:	fallbackTo( o.afterPrintingArray, '' )
			},
			printLabel			:	{
				before:	fallbackTo( o.beforeOpeningLabel, '' ),
				after:	fallbackTo( o.afterClosingLabel, '' )
			},
			printLabelInner		:	{
				before:	fallbackTo( o.beforePrintingLabel, '' ),
				after:	fallbackTo( o.afterPrintingLabel, '' )
			},
			printString			:	{
				before:	fallbackTo( o.beforeOpeningString, '' ),
				after:	fallbackTo( o.afterClosingString, '' )
			},
			printStringInner	:	{
				before:	fallbackTo( o.beforePrintingString, '' ),
				after:	fallbackTo( o.afterPrintingString, '' )
			},
			printEscape			:	{
				before:	fallbackTo( o.beforePrintingEscape, '' ),
				after:	fallbackTo( o.afterPrintingEscape, '' )
			},
			printNumber			:	{
				before:	fallbackTo( o.beforePrintingNumber, '' ),
				after:	fallbackTo( o.afterPrintingNumber, '' )
			},
			printPositive		:	{
				before:	fallbackTo( o.beforePrintingPlus, '' ),
				after:	fallbackTo( o.afterPrintingPlus, '' )
			},
			printNegative		:	{
				before:	fallbackTo( o.beforePrintingMinus, '' ),
				after:	fallbackTo( o.afterPrintingMinus, '' )
			},
			printDecimal			:	{
				before:	fallbackTo( o.beforePrintingDecimal, '' ),
				after:	fallbackTo( o.afterPrintingDecimal, '' )
			},
			printExponent		:	{
				before:	fallbackTo( o.before, '' ),
				after:	fallbackTo( o.after, '' )
			},
			printTrue			:	{
				before:	fallbackTo( o.beforePrintingTrue, '' ),
				after:	fallbackTo( o.afterPrintingTrue, '' )
			},
			printFalse			:	{
				before:	fallbackTo( o.beforePrintingFalse, '' ),
				after:	fallbackTo( o.afterPrintingFalse, '' )
			},
			printNull			:	{
				before:	fallbackTo( o.beforePrintingNull, '' ),
				after:	fallbackTo( o.afterPrintingNull, '' )
			},
			printComma			:	{
				before:	fallbackTo( o.beforePrintingComma, '' ),
				after:	fallbackTo( o.afterPrintingComma, '' )
			},
			printDividerColon	:	{
				before:	fallbackTo( o.beforePrintingColon, '' ),
				after:	fallbackTo( o.afterPrintingColon, '' )
			},
			printNameValue		:	{
				before:	fallbackTo( o.beforePrintingParam, '' ),
				after:	fallbackTo( o.afterPrintingParam, '' )
			},
			printError			:	{
				before:	fallbackTo( o.beforeError, '' ),
				after:	fallbackTo( o.afterError, '' )
			},
			unfinished			:	fallbackTo( o.afterUnfinished, '' )
		},

		states		=	{

			'waiting for start':	{
				allows:		[
					{
						name	:	'openCurly',
						method	:	openObject
					},
					{
						name	:	'openSquare',
						method	:	openArray
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'waiting for label':	{
				allows:		[
					{
						name	:	'quote',
						method	:	openLabel
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'opened an object':	{
				allows:		[
					{
						name	:	'quote',
						method	:	openLabel
					},
					{
						name	:	'closeContainer',
						method	:	closeContainer
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'waiting for value':	{
				allows:		[
					{
						name	:	'quote',
						method	:	openString
					},
					{
						name	:	'number',
						method	:	openNumber
					},
					{
						name	:	'sign',
						method	:	openNumber
					},
					{
						name	:	'decimal',
						method	:	openNumber
					},
					{
						name	:	'exponent',
						method	:	openNumber
					},
					{
						name	:	'openCurly',
						method	:	openObject
					},
					{
						name	:	'openSquare',
						method	:	openArray
					},
					{
						name	:	'true_',
						method	:	printTrue
					},
					{
						name	:	'false_',
						method	:	printFalse
					},
					{
						name	:	'null_',
						method	:	printNull
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'opened an array':	{
				allows:		[
					{
						name	:	'quote',
						method	:	openString
					},
					{
						name	:	'number',
						method	:	openNumber
					},
					{
						name	:	'sign',
						method	:	openNumber
					},
					{
						name	:	'decimal',
						method	:	openNumber
					},
					{
						name	:	'exponent',
						method	:	openNumber
					},
					{
						name	:	'openCurly',
						method	:	openObject
					},
					{
						name	:	'openSquare',
						method	:	openArray
					},
					{
						name	:	'true_',
						method	:	printTrue
					},
					{
						name	:	'false_',
						method	:	printFalse
					},
					{
						name	:	'null_',
						method	:	printNull
					},
					{
						name	:	'closeContainer',
						method	:	closeContainer
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'printing label':	{
				allows:		[
					{
						name	:	'string',
						method	:	printCharacter
					},
					{
						name	:	'backslash',
						method	:	openEscape
					},
					{
						name	:	'quote',
						method	:	closeLabel
					}
				]
			},

			'printing string':	{
				allows:		[
					{
						name	:	'string',
						method	:	printCharacter
					},
					{
						name	:	'backslash',
						method	:	openEscape
					},
					{
						name	:	'quote',
						method	:	closeString
					}
				]
			},

			'starting number':	{
				allows:		[
					{
						name	:	'number',
						method	:	printInteger
					},
					{
						name	:	'decimal',
						method	:	openDecimal
					},
					{
						name	:	'exponent',
						method	:	printExponent
					}
				]
			},

			'printing integer':	{
				allows:		[
					{
						name	:	'number',
						method	:	printInteger
					},
					{
						name	:	'decimal',
						method	:	openDecimal
					},
					{
						name	:	'closeContainer',
						method	:	closeNumber
					},
					{
						name	:	'comma',
						method	:	closeNumber
					},
					{
						name	:	'space',
						method	:	closeNumber
					}
				]
			},

			'printing decimal':	{
				allows:		[
					{
						name	:	'number',
						method	:	printDecimal
					},
					{
						name	:	'closeContainer',
						method	:	closeNumber
					},
					{
						name	:	'comma',
						method	:	closeNumber
					},
					{
						name	:	'space',
						method	:	closeNumber
					}
				]
			},

			'waiting for colon':	{
				allows:		[
					{
						name	:	'colon',
						method	:	printDividerColon
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'just ended a value':	{
				allows:		[
					{
						name	:	'closeContainer',
						method	:	closeContainer
					},
					{
						name	:	'comma',
						method	:	startNextValue
					},
					{
						name	:	'space',
						method	:	ignore
					}
				]
			},

			'printing special':	{
				allows:		[
					{
						name	:	'letter',
						method	:	printSpecial
					}
				]
			},

			'printing escape':	{
				allows:		[
					{
						name	:	'any',
						method	:	printCharacter
					}
				]
			},

			'done.':	{
				allows:		[
					{
						name	:	'any',
						method	:	ignore
					}
				]
			}
		},

		charTypes	=	{
			openCurly		:	/\{/,
			openSquare		:	/\[/,
			closeCurly		:	/\}/,
			closeSquare		:	/\]/,
			closeContainer	:	/\]|\}/,
			space			:	/\s/,
			quote			:	/"/,
			string			:	/[^"\\]/,
			number			:	/\d/,
			sign			:	/-|\+/,
			letter			:	/\w/,
			decimal			:	/\./,
			backslash		:	/\\/,
			colon			:	/:/,
			exponent		:	/e/,
			true_			:	/t/,
			false_			:	/f/,
			null_			:	/n/,
			any				:	/.?/,
			comma			:	/,/
		};

	var	splitString		=	string.split('').reverse(),
		inside			=	[],
		newString		=	'',
		previousChars	=	[],

		labelQuote		=	o.hideLabelQuotes		?	''	:	'"',
		stringQuote		=	o.hideStringQuotes		?	''	:	'"',
		colonChar		=	o.hideColons			?	''	:	':',

		openObjectChar	=	o.hideCurlyBraces		?	''	:	'{',
		closeObjectChar	=	o.hideCurlyBraces		?	''	:	'}',

		openArrayChar	=	o.hideSquareBrackets	?	''	:	'[',
		closeArrayChar	=	o.hideSquareBrackets	?	''	:	']',

		stateName		=	'waiting for start',
		printingLetters	=	[],
		char			=	'',
		escaping		=	false,

		finalString		=	DOM.container.before;

	while ( splitString.length ) {
		loopSequence();
		previousChars.push(char);
		if ( previousChars.length > 50 ) {
			previousChars.shift();
		}
		//console.log(inside);
	}
	finalString	+=	DOM.container.after;

	if ( stateName !== 'done.' ) {
		finalString	+=	DOM.unfinished;
	}

	return finalString;
	//console.log(finalString);
}