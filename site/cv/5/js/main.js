/*
 * DEFINE Functions
 */
function openJob () {
	this.className = this.className.replace( /\bclosed\b/g, ' ' ).replace( / +/g, ' ' );
	this.onclick = undefined;
}

function closeJob ( job ) {
	job.className += ' closed';
}





/*
 * DEFINE Variables
 */
var jobs = document.getElementsByClassName('job'),
	windowHash = window.location.hash,
	activeJob = document.getElementById( windowHash.substr( 1 ) ),
	i = 0;





/*
 * DEFINE Logic
 */
for (; i<jobs.length; i+=1 ) {
	closeJob( jobs[i] );
	
	jobs[i].onclick = openJob;
}

console.log(activeJob);
if ( activeJob ) {
	openJob.bind( activeJob )();
}