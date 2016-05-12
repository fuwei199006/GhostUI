/* 
 * @Author: anchen
 * @Date:   2016-05-12 21:20:47
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-05-12 22:27:08
 */
(function($,undefine){
      $.swipeInit=function(element){
        var isTouchMove, startTx, startTy;
             element.on('touchstart', function(e) {
                var touches = e.originalEvent.targetTouches[0];
                startTx = touches.clientX;
                startTy = touches.clientY;
                isTouchMove = false;
            });
             element.on('touchmove', function(e) {
                isTouchMove = true;
                e.preventDefault();
            });
           element.on('touchend', function(e) {
                if (!isTouchMove) {
                    return;
                }
                var touches = e.originalEvent.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY,
                    distanceX = startTx - endTx,
                    distanceY = startTy - endTy,
                    isSwipe = false;
                if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                    if (distanceX > 20) {
                        element.trigger('swipeleft');
                        isSwipe = true;
                    } else if (distanceX < -20) {
                       element.trigger('swiperight');
                        isSwipe = true;
                    }
                }
                if (Math.abs(distanceY) >= Math.abs(distanceX)) {
                    if (distanceY > 20) {
                        element.trigger('up');
                        isSwipe = true;
                    } else if (distanceY < -20) {
                       element.trigger('down');
                        isSwipe = true;
                    }
                }
            });
           return element;
      }
       

})(jQuery);
