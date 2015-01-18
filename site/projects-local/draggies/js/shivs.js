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



function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}