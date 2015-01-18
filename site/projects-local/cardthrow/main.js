/*
function setDrag(e) {
    landingSpot = {
        x: e.clientX - $stack.width() / 2,
        y: e.clientY - $stack.height() / 2
    };

}
*/

function buildACard () {
    var aCard   = new Card({
            stack:  $('.stack'),
            posx:   (Math.random() * offsetMax.x*2) - offsetMax.x,
            toposx: landingSpot.x,
            posy:   (Math.random() * offsetMax.y*2) - offsetMax.y,
            toposy: landingSpot.y,
            spdx:   Math.random()*$stack.width()  - $stack.width()/2,
            spdy:   Math.random()*$stack.height() - $stack.height()/2,
            rot:    Math.random()*360,
            spdr:   Math.random()*6 - 3
        }),
        color  = 'rgb(' +   Math.round(Math.random()*25+230) + ',' +
                            Math.round(Math.random()*25+230) + ',' +
                            Math.round(Math.random()*25+230) + ')';

    $(aCard.elt).css({
        'background-color': color,
        'background-image': 'url("' + images[cards_visible.length] + '")'
    });

    cards_visible.push(aCard);
    cards_active.push(aCard);
    orderStack();

}



// Variables
var $window = $(window),
    $stack  = $('.stack'),
    $cards  = $('.card'),

    time_lastcalc = +new Date(),
    frames_done = 0,

    rps = 30, // attempted renders per second
    cps = 30, // calculations per second
    mspr = 1000 / rps,
    mspc = 1000 / cps,

    // Global forces
    gravity = 7,
    friction = 0.80,
    rotDrag  = 0.90,
    cutoff = 2,

    // Finding how far a card can move without
    // going out of the window bounds
    offsetMax = {
        x:  $window.width() / 2 - $stack.width() / 2,
        y:  $window.height() / 2 - $stack.height() / 2
    },

    // Setting the offset for cards to land
    landingSpot = {
        x:  25,
        y:  25
    },

    // Mouse position cache
    mousemovePrev  = {
        x:  offsetMax.x,
        y:  offsetMax.y
    },
    mousemovePrev2  = {
        x:  offsetMax.x,
        y:  offsetMax.y
    },

    // Set distance cards need to br dragged
    // to be pushed up or down the deck
    shuffleDistance = {
        up:    200,
        right: 200,
        down:  200,
        left:  200
    },

    cards_visible   = [],
    cards_active    = [],
    cards_inactive  = [],
    cards_dragging  = [],

    images  = [
        'http://a2.mzstatic.com/us/r30/Purple4/v4/87/b2/69/87b26965-a23f-4ab5-b254-46c2dbc74904/icon_256.png',
        'http://idigitalcitizen.files.wordpress.com/2009/07/pinkhellokitty.jpg?w=256',
        'http://a4.mzstatic.com/us/r30/Purple/v4/0c/6d/a2/0c6da2cc-f6a0-ae6f-d082-87eeba8a5112/icon_256.png',
        'http://a5.mzstatic.com/us/r30/Purple2/v4/86/90/c6/8690c6eb-4546-a5cc-8292-b86a165410ec/icon_256.png',
        'http://a4.mzstatic.com/us/r30/Purple/v4/c5/1a/96/c51a96ca-0116-6002-68ea-bb4d0fbe8cc3/icon_256.png',
        'http://www.adiumxtras.com/images/thumbs/hello_kitty_fixed_2_5481_2574_thumb.png',
        'http://a4.mzstatic.com/us/r30/Purple/v4/1d/26/8d/1d268d74-4dcd-9d08-aa33-960f2d55494c/icon_256.png',
        'http://a2.mzstatic.com/eu/r30/Purple2/v4/b9/22/b3/b922b3c1-1c82-04cb-f5ee-a3b50f608ddc/icon_256.png',
        'https://www.neatoshop.com/images/product/83/6383/Hello-Kitty-British-Backpack_31983-s.jpg?v=31983',
        'http://a5.mzstatic.com/us/r30/Purple/v4/51/e6/09/51e6097e-1b6d-6bf8-8119-ebb94bce575f/icon_256.png',
        'http://a4.mzstatic.com/us/r30/Purple/v4/26/a3/0b/26a30bcf-9e82-eac0-3371-be2c488975d0/icon_256.png',
        'http://a3.mzstatic.com/us/r30/Purple/v4/66/b4/d6/66b4d6fd-e351-9f3a-c40f-aa980d33a6b4/icon_256.png',
        'http://a1.mzstatic.com/us/r30/Purple4/v4/62/31/1e/62311e9f-8be8-09ee-fefe-4cb567ab69fd/icon_256.png',
    ],
    loadedImages    = 0,
    cardCount = images.length,
    i = 0;
images = shuffleArray(images);

for ( var imagesLoadInatiatedCount=0; imagesLoadInatiatedCount<images.length; imagesLoadInatiatedCount+=1 ) {
    var imageLoad = new Image();
    imageLoad.onload = checkIfImageNeedsLoading;
    imageLoad.src = images[imagesLoadInatiatedCount];

}
function checkIfImageNeedsLoading () {
    loadedImages+=1;
    $stack.empty();
    if ( loadedImages === images.length ) {
        cardBuildInt();
    }

}


$stack.css({
    left:   offsetMax.x + 'px',
    top:    offsetMax.y + 'px'
});
function cardBuildInt () {
    buildACard();
    if ( cards_visible.length < cardCount ) {
        setTimeout( cardBuildInt, 1000/images.length );

    } else {
        setCardAngle();

    }
}

var interval_sim = setInterval(sim, mspc);
setInterval(renderCards, mspr);
$window.on( BJ.interact.end, endDragging );
$window.on( BJ.interact.move, dragMove );