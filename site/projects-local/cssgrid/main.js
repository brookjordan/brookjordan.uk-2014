function byID ( id ) {
	return document.getElementById( id );
}

function on ( events, func ) {
	var i = 0;
	events = events.split( ' ' );

	for (; i<events.length; i+=1 ) {
		this.addEventListener( events[i], func, false );
	}
}
HTMLInputElement.prototype.on =
HTMLDivElement.prototype.on =
HTMLBodyElement.prototype.on = on;


function setCSS () {
	var accu = 1e12,
		cols, i,
		pddn,

		spcr = inpt_spcr.value === 'm' ?
			'margin' :
			'padding',

		dvcs = [
			{ name: 'smallphone', width: 240 },
			{ name: 'phone', width: 480 },
			{ name: 'tablet', width: 1024 }
		], j,
		wdth,
		p_wd, f_pw,
		c_wd, c_nm, f_cw, f_nm,
		st_v = '';

	try {
		cols = parseInt( eval(inpt_cols.value), 10 ) || 2;
	} catch (e) {
		cols = 2;
	}

	try {
		pddn = parseInt( eval(inpt_spcg.value), 10 ) || 0;
	} catch (e) {
		pddn = 0;
	}

	wdth = !isNaN( 100/cols ) ? 100/cols : 50;
	p_wd = wdth/100*pddn;
	f_pw = Math.floor( p_wd*accu )/accu;


	st_v += '\n.row{';
	st_v += 'float: left;';
	st_v += '}\n';
	
	st_v += '\n.row:before,';
	st_v += '\n.row:after {';
	st_v += '\ncontent: " ";';
	st_v += '\ndisplay: table;';
	st_v += '\n}\n';
	st_v += '\n.row:after {';
	st_v += '\nclear: both;';
	st_v += '\n}\n';

	st_v += '\n.row > * {';
	st_v += '\nfloat: left;';
	st_v += '\n}\n';


	st_v += '\n.row > .clear{\n';
	st_v += 'clear:left;';
	st_v += '}';
	

	for ( i=cols; i>0; i-- ) {
		c_nm = wdth*i,
		c_wd = c_nm - p_wd*2;
		f_nm = Math.floor( c_nm*accu )/accu;
		f_cw = Math.floor( c_wd*accu )/accu;


		st_v += '\n.row_' + i;
		st_v += ',\n.row.nopad > .grid_' + i;
		st_v += ',\n.row > .nopad.grid_' + i;
		if ( i === cols ) {
			st_v += ',\n.row.nopad > *';
			st_v += ',\n.row > .nopad';
		}
		st_v += '{\nwidth:' + f_nm + '%;\n';
		st_v += spcr + '-left:0%;\n';
		st_v += spcr + '-right:0%;\n';
		st_v += '}';


		st_v += '\n.row > .grid_' + i;
		st_v += ',\n.row > .pad.grid_' + i;
		if ( i === cols ) {
			st_v += ',\n.row > *';
			st_v += ',\n.row > .pad';
		}
		st_v += '{\nwidth:' + f_cw + '%;\n';
		st_v += spcr + '-left:' + f_pw + '%;\n';
		st_v += spcr + '-right:' + f_pw + '%;\n';
		st_v += '}';
	}

	for ( j=dvcs.length-1; j>-1; j-=1 ) {
		st_v += '\n\n@media (max-width: ' + dvcs[j].width + 'px) {'

			st_v += '\n.row > .on' + dvcs[j].name + '_clear{\n';
			st_v += 'clear:left;';
			st_v += '}';

			st_v += '\n.row > .on' + dvcs[j].name + '_flow{\n';
			st_v += 'clear:none;';
			st_v += '}';

			for ( i=cols; i>0; i-- ) {
				c_nm = wdth*i,
				c_wd = c_nm - p_wd*2;
				f_nm = Math.floor( c_nm*accu )/accu;
				f_cw = Math.floor( c_wd*accu )/accu;
				

				st_v += '\n.row.on' + dvcs[j].name + '_' + i;
				st_v += ',\n.row.nopad > .on' + dvcs[j].name + '_' + i;
				st_v += ',\n.row > .nopad.on' + dvcs[j].name + '_' + i;
				if ( i === cols ) {
					st_v += ',\n.row.on' + dvcs[j].name + '_fill';
					st_v += ',\n.row.nopad > .on' + dvcs[j].name + '_fill';
					st_v += ',\n.row > .nopad.on' + dvcs[j].name + '_fill';
				}
				st_v += '{\nwidth:' + f_nm + '%;\n';
				st_v += spcr + '-left:0%;\n';
				st_v += spcr + '-right:0%;\n';
				st_v += '}';
				

				st_v += '\n.row > .on' + dvcs[j].name + '_' + i;
				st_v += ',\n.row > .pad.on' + dvcs[j].name + '_' + i;
				if ( i === cols ) {
					st_v += ',\n.row > .on' + dvcs[j].name + '_fill';
					st_v += ',\n.row > .pad.on' + dvcs[j].name + '_fill';
				}
				st_v += '{\nwidth:' + f_cw + '%;\n';
				st_v += spcr + '-left:' + f_pw + '%;\n';
				st_v += spcr + '-right:' + f_pw + '%;\n';
				st_v += '}';
			}
		st_v += '\n}'
	}

	otpt_otpt.innerHTML = st_v;
	inpt_otpt.value     = st_v;
}


var inpt_cols = byID ( 'columns' ),
    inpt_spcg = byID ( 'spacing' ),
    inpt_spcr = byID ( 'spacer' ),
	inpt_otpt = byID ( 'output' ),
	otpt_otpt = byID ( 'style' );

inpt_cols.on( 'keyup blur', setCSS );
inpt_spcg.on( 'keyup blur', setCSS );
inpt_spcr.on( 'keyup blur', setCSS );
setCSS ();