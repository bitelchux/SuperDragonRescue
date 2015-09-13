'use strict';

var ViewPort = function( gs ) {
	this.width = gs.width;
	this.height = gs.height;
	this.x = 0;
	this.y = 0;

	// deadzone in center of screen
	this.minXmove = 400;
	this.maxXmove = this.width - 500;
};

ViewPort.prototype = {
	// check if rectangle is in the viewport
	vis: function( br ) {

		// we want our boss to always update, even when off screen.
		if ( br.isBoss ) {
			return true;
		}

		var r1 = {
			r : br.x + br.width,
			l : br.x,
			t : br.y,
			b : br.y + br.height
		};

		var r2 = {
			r : (this.x * -1) + this.width,
			l : (this.x * -1),
			t : this.y,
			b : this.y + this.height
		};

		return !(r2.l > r1.r ||
			r2.r < r1.l ||
			r2.t > r1.b ||
			r2.b < r1.t);
	}
};

module.exports = ViewPort;
