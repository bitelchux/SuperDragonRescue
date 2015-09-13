'use strict';

var Keyboarder = function() {
	var self = this;
	this.keyState = {};
	window.addEventListener('keydown', function(e) {
		// for certain keys you want to call e.preventDefault() to stop brower windows scrolling etc
		if ( self.preventKeys.indexOf(e.keyCode) > -1 ) {
            e.preventDefault();
            e.stopPropagation();
        }
		self.keyState[e.keyCode] = true;
	});
	window.addEventListener('keyup', function(e) {
		self.keyState[e.keyCode] = false;
	});

	// amend as required
	this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, SPACE: 32, ENTER: 13, ESC: 27 };
	// populate KEYS with all the alphabetic keys A - Z
	for (var i = 65; i < 91; i++ ) {
		// console.log(String.fromCharCode(i), i);
		this.KEYS[String.fromCharCode(i)] = i;
	}

	// stop these key events from propagating, so that player doesn't accidentally interact with browser window (scrolling etc)
    this.preventKeys = [ this.KEYS.LEFT,
                         this.KEYS.RIGHT,
                         this.KEYS.UP,
                         this.KEYS.DOWN,
                         this.KEYS.SPACE,
						this.KEYS.ENTER,
						this.KEYS.ESC
												 /* not defined
												 this.KEYS.BKSP,
												 this.KEYS.TAB,
												 this.KEYS.PGUP,
												 this.KEYS.PGDN,
												 this.KEYS.END,
												 this.KEYS.HOME,
												 this.KEYS.CTRL,
												 this.KEYS.ALT,
												  */
                        ];
};

Keyboarder.prototype = {
	isDown: function(key) {
		return this.keyState[this.KEYS[key]] === true;
	},
	isUp: function(key) {
		return this.keyState[this.KEYS[key]] === false;
	}
};

module.exports = Keyboarder;
