var BJ = BJ || {};

(function setInteractVariables () {
    BJ.interact = {};

    if ( 'ontouchstart' in window  ||  'onmsgesturechange' in window ) {
        BJ.interact.start  = 'touchstart';
        BJ.interact.move   = 'touchmove';
        BJ.interact.end    = 'touchend';

    } else {
        BJ.interact.start  = 'mousedown';
        BJ.interact.move   = 'mousemove';
        BJ.interact.end    = 'mouseup';

    }
}());