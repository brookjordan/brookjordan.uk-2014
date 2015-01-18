function shuffleArray ( array ) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function buildStartDragging ( aCard ) {
    return function startDragging ( e ) {
        e.preventDefault();

        var movingIndex = cards_active.indexOf( aCard );

        if ( movingIndex !== -1 ) {
            cards_dragging.push( cards_active.splice( movingIndex, 1 )[0] );
            $(aCard.elt).addClass('holding');

            aCard.refposx   = aCard.posx;
            aCard.refposy   = aCard.posy;

        }

        setPrevMousePos( e );
    };

}

function dragMove ( e ) {
    e.preventDefault();

    var i=0,
        aCard;

    for (; i<cards_dragging.length; i+=1 ) {
        aCard   = cards_dragging[ i ];
        aCard.posx  += e.clientX - mousemovePrev.x;
        aCard.posy  += e.clientY - mousemovePrev.y;

    }

    setPrevMousePos( e );

}

function endDragging ( e ) {
    e.preventDefault();

    var i=0,
        aCard;

    for (; i<cards_dragging.length; i+=1 ) {
        aCard   = cards_dragging.splice( i, 1 )[0];

        if ( aCard.posx < -shuffleDistance.left  ||  aCard.posy < -shuffleDistance.up ) {
            cardToBottom( aCard );

        } else if ( aCard.posx > shuffleDistance.right  ||  aCard.posy > shuffleDistance.down ) {
            cardToTop( aCard );

        }
        $(aCard.elt).removeClass('holding');
        cards_active.push( aCard );
        aCard.spdx  = mousemovePrev.x - mousemovePrev2.x;
        aCard.spdy  = mousemovePrev.y - mousemovePrev2.y;

    }

    setPrevMousePos( e );
    setCardAngle();

}

function setPrevMousePos ( e ) {
    mousemovePrev2     = {
        x: mousemovePrev.x,
        y: mousemovePrev.y
    };

    mousemovePrev   = {
        x: e.clientX,
        y: e.clientY
    };

}

function eachCard ( func ) {
    var i = 0;

    for (; i<cards_visible.length; i+=1 ) {
        func( cards_visible[i], i );
    }

}

function orderStack ( by ) {
    var i = 0;

    by = by || 'order';

    if ( by === 'order' ) {
        eachCard(function( aCard, index ){
            aCard.elt.style.zIndex = index;
        });

    } else if ( by === 'random' ) {
        eachCard(function( aCard ){
            aCard.elt.style.zIndex = Math.round( Math.random(9999999) );
        });

    }
}

function setCardAngle ( angle, aCard ) {
    angle = angle || 0;
    aCard = aCard || cards_visible[cards_visible.length-1];
    aCard.torot = angle;

}

function cardToTop ( aCard ) {
    if ( typeof aCard === 'number' ) {
        aCard = cards_visible[ aCard ];
    }

    cards_visible.splice( cards_visible.indexOf( aCard ), 1 );
    cards_visible.push( aCard );

    orderStack();
    setCardAngle();
}

function cardToBottom ( aCard ) {
    if ( typeof aCard === 'number' ) {
        aCard = cards_visible[ aCard ];
    }

    aCard.spdr  = Math.random()*100 - 50;
    aCard.torot = null;
    aCard.accr  = 0;
    cards_visible.splice( cards_visible.indexOf( aCard ), 1 );
    cards_visible.unshift( aCard );

    orderStack();
    setCardAngle();
}

function buildBoostCard ( aCard ) {
    return function boostCard ( e ) {
        e.preventDefault();

        var spd = getComponents( Math.random(), Math.random() );

        aCard.spdx  = spd.x*200-100;
        aCard.spdy  = spd.y*200-100;
        aCard.accx  = 0;
        aCard.accy  = 0;
    };

}

function moveCard(aCard, options) {
    var o = options || {};

    aCard.posx = o.posx || aCard.posx;
    aCard.posy = o.posy || aCard.posy;
    aCard.rot = o.rot || aCard.rot;

}

function moveCards() {
    var i = 0;

    for (; i < cards_active.length; i += 1) {
        pullCard(cards_active[i]);
        simCard(cards_active[i]);

    }

}

function pullCard(aCard) {
    var distx   = aCard.toposx - aCard.posx,
        disty   = aCard.toposy - aCard.posy,

        dirx    = distx === 0 ? 0 : distx > 0 ? 1 : -1,
        diry    = disty === 0 ? 0 : disty > 0 ? 1 : -1,

        ratiox  = Math.abs(distx),
        ratioy  = Math.abs(disty),

        angle,
        acc;

    if (ratiox < 20  &&  ratioy < 20) {
        aCard.accx = 0;
        aCard.accy = 0;

    } else if (ratiox < 20) {
        aCard.accx = 0;
        aCard.accy = diry * gravity;

    } else if (ratioy < 20) {
        aCard.accx = dirx * gravity;
        aCard.accy = 0;

    } else {
        acc = getComponents( ratiox, ratioy );

        aCard.accx = acc.x * gravity * dirx;
        aCard.accy = acc.y * gravity * diry;

    }

    if ( aCard.torot !== null ) {
        var rotRel  = aCard.rot%360;

        if ( rotRel < 0 ) {
            rotRel += 360;
        }
        aCard.rot = rotRel;

        if ( ( aCard.rot-aCard.torot+360 )%360 > 180 ) {
            aCard.accr = 4;
        } else {
            aCard.accr = -4;
        }
    }

}

function getComponents ( x, y ) {
    var accx,  accy;

    x   = Math.abs(x);
    y   = Math.abs(y);

    angle = Math.atan(x/y);

    accx    = Math.abs(Math.sin(angle));
    accy   = (accx / x) * y;

    return {
        x: accx,
        y: accy
    };

}

function simCard( aCard ) {
    var cardIsMoving    = false;

    if ( Math.abs( aCard.spdx ) > cutoff  ||  Math.abs( aCard.accx ) > cutoff ) {
        aCard.spdx = (aCard.spdx + aCard.accx)*friction;
        aCard.posx += aCard.spdx;
        cardIsMoving    = true;

    } else {
        aCard.spdx = 0;

    }

    if ( Math.abs( aCard.spdy ) > cutoff  ||  Math.abs( aCard.accy ) > cutoff ) {
        aCard.spdy = (aCard.spdy + aCard.accy)*friction;
        aCard.posy += aCard.spdy;
        cardIsMoving    = true;

    } else {
        aCard.spdy = 0;

    }

    if ( ( aCard.torot === null  &&  ( Math.abs(aCard.spdr)>1  ||  Math.abs(aCard.accr)>1 )  )   ||   ( aCard.torot !== null  &&  Math.abs( ( aCard.rot-aCard.torot+360 )%360 - 360 ) > 4 ) ) {
        aCard.spdr = (aCard.spdr + aCard.accr)*friction;
        aCard.rot += aCard.spdr;
        cardIsMoving    = true;

    } else {
        aCard.spdr = 0;
        aCard.accr = 0;
        if ( aCard.torot !== null ) {
            aCard.rot   = aCard.torot;
            aCard.torot = null;
        }

    }

}

function deactivateCard ( aCard ) {
    cards_inactive.push( cards_active.splice( cards_active.indexOf( aCard ), 1 ) );

}

function activateCard ( aCard ) {
    cards_active.push( cards_inactive.splice( cards_inactive.indexOf( aCard ), 1 ) );

}

function renderCards() {
    var i = 0;

    for (; i < cards_visible.length; i += 1) {
        eachCard( renderCard );

    }

}

function sim() {
    var time_now = +new Date(),
        time_diff = time_now - time_lastcalc,
        i = Math.floor(time_diff / mspc);

    time_lastcalc += i * mspc;

    for (; i > 0; i -= 1) {
        moveCards();
    }
}

function Card(options) {
    var o = options || {},
        stack = o.stack || $('.stack').eq(0),
        $stack = $(stack);


    // Set position
    this.posx       = o.posx    || 0;
    this.toposx     = typeof o.toposx === 'number' ? o.toposx  : o.posx;
    this.initposx   = this.refposx  = this.posx;
    this.posy       = o.posy    || 0;
    this.toposy     = typeof o.toposy === 'number' ? o.toposy  : o.posy;
    this.initposy   = this.refposy  = this.posy;
    this.rot        = o.rot     || 0;
    this.torot      = o.torot   || null;


    // Set movement
    this.spdx   = o.spdx    || 0;
    this.spdy   = o.spdy    || 0;
    this.spdr   = o.spdr    || 0; // rotation speed

    this.accx   = o.accx    || 0;
    this.accy   = o.accy    || gravity;
    this.accr   = o.accr    || 0; // rotation accelleration

    // Initially hide
    this.hidden = true;

    // Create drag event
    this.ondrag     = buildStartDragging(this);
    this.boost      = buildBoostCard(this);

    // Create Element
    this.elt    = o.elt || document.createElement('div');

    $(this.elt)
        .addClass('card')
        .hide()
        //.on('click', this.boost);
        .on( BJ.interact.start + '.startDrag', this.ondrag);

    $stack.append(this.elt);

}


// Variable functions
var renderCard  = (function () {
    function showHidden ( aCard ) {
            if ( aCard.hidden ) {
                aCard.hidden    = false;
                aCard.elt.style.display = 'block';
            }
    }



    var prefixes    = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        transform   = '',
        i           = 0;



    for (; i<prefixes.length; i+=1 ) {
        if ( typeof document.body.style[prefixes[i]] !== 'undefined' ) {
            transform   = prefixes[i];
        }
    }

    if ( transform !== '' ) {
        return function (aCard) {
            var posString = 'translate(' + aCard.posx + 'px,' + aCard.posy + 'px)' +
                'rotate(' + aCard.rot + 'deg)';

            showHidden ( aCard );

            aCard.elt.style[transform] = posString;

        };

    } else {
        return function (aCard) {
            showHidden ( aCard );

            aCard.elt.style.left    = aCard.posx + 'px';
            aCard.elt.style.top     = aCard.posy + 'px';

        };

    }

}());