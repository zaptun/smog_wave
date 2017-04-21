(function() {
    var beginAC = 80,
        endAC = 320,
        beginB = 80,
        endB = 320;

    function inAC(s) {
        s.draw('80% - 240', '80%', 0.3, {
            delay: 0.1,
            callback: function() {
                inAC2(s)
            }
        });
    }

    function inAC2(s) {
        s.draw('100% - 545', '100% - 305', 0.6, {
            easing: ease.ease('elastic-out', 1, 0.3)
        });
    }

    function inB(s) {
        s.draw(beginB - 60, endB + 60, 0.1, {
            callback: function() {
                inB2(s)
            }
        });
    }

    function inB2(s) {
        s.draw(beginB + 120, endB - 120, 0.3, {
            easing: ease.ease('bounce-out', 1, 0.3)
        });
    }

    /* Out animations (to burger icon) */

    function outAC(s) {
        s.draw('90% - 240', '90%', 0.1, {
            easing: ease.ease('elastic-in', 1, 0.3),
            callback: function() {
                outAC2(s)
            }
        });
    }

    function outAC2(s) {
        s.draw('20% - 240', '20%', 0.3, {
            callback: function() {
                outAC3(s)
            }
        });
    }

    function outAC3(s) {
        s.draw(beginAC, endAC, 0.7, {
            easing: ease.ease('elastic-out', 1, 0.3)
        });
    }

    function outB(s) {
        s.draw(beginB, endB, 0.7, {
            delay: 0.1,
            easing: ease.ease('elastic-out', 2, 0.4)
        });
    }

    var pathA = document.getElementById('pathA'),
        pathB = document.getElementById('pathB'),
        pathC = document.getElementById('pathC'),
        segmentA = new Segment(pathA, beginAC, endAC),
        segmentB = new Segment(pathB, beginB, endB),
        segmentC = new Segment(pathC, beginAC, endAC),
        trigger = document.getElementById('menu-icon-trigger'),
        toCloseIcon = true,
        dummy = document.getElementById('dummy'),
        wrapper = document.getElementById('menu-icon-wrapper');

    wrapper.style.visibility = 'visible';

    trigger.onclick = function() {
        if (toCloseIcon) {
            inAC(segmentA);
            inB(segmentB);
            inAC(segmentC);

            dummy.className = 'site_nav dummy--active';
        } else {
            outAC(segmentA);
            outB(segmentB);
            outAC(segmentC);

            dummy.className = 'site_nav';
        }
        toCloseIcon = !toCloseIcon;
    };

    /* Scale functions */

    function addScale(m) {
        m.className = 'menu-icon-wrapper scaled';
    }

    function removeScale(m) {
        m.className = 'menu-icon-wrapper';
    }

})();
