'use strict';

var Animation = function( ss, data ) {

	this.ss = ss;
	this.data = data;
	// array with:
	// spritesheet x offset,
	// spritesheet y offset,
	// spritesheet width,
	// spritesheet height,
	// duration
	// nextframe

	this.c = 0; // currentFrame
	this.s = 4; // scale
	this.ts = new Date().getTime();
};

Animation.prototype = {
	render: function( c, flip, x, y ) {
		var d = this.data;

		if ( !flip ) {
			c.save();
            c.translate(c.canvas.width, 0);
            c.scale(-1, 1);
			c.drawImage( this.ss, this.f(0), this.f(1), this.f(2), this.f(3),
						(c.canvas.width - x - (this.f(2) * this.s)),
						y, this.f(2) * this.s, this.f(3) * this.s );
			c.restore();
		} else {
			c.drawImage( this.ss, this.f(0), this.f(1), this.f(2), this.f(3), x, y, this.f(2) * this.s, this.f(3) * this.s );
		}
	},
	update: function() {
		var now = new Date().getTime();
		if ( (now - this.ts) > this.f(4) ) {
			this.ts = now;
			this.c = this.f(5);
		}
	},
	f: function(t) {
		return this.data[t + (6 * this.c)];
	}
};

module.exports = Animation;
