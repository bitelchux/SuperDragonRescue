'use strict';

var Animation = require('./animation');

// doubles as a removable wall and chilli :o
function Knight( l, x, y, t ) {
	this.lvl = l;
	this.x = x;
	this.y = y;
	this.width = 14 * 4;
	this.height = 27 * 4;

	this.dead = this.door = this.pickup = this.isKnight = false;

	// blob
	var ad = [
			  [ 333, 32, 14, 27, 1000, 0 ],   // knight
			  [ 347, 32, 24, 17, 1000, 0 ],   // yay
			  [ 64, 48, 16, 16, 1000, 0 ],    // purple block
			  [ 240, 48, 16, 16, 1000, 0]     // chilli
			 ];
	// spritesheet x offset,
	// spritesheet y offset,
	// spritesheet width,
	// spritesheet height,
	// duration
	// nextframe

	this.anim1 = new Animation( this.lvl.parent.images[0], ad[0] ); // knight
	this.anim2 = new Animation( this.lvl.parent.images[0], ad[1] ); // yay

	if ( t === 0 ) {
		this.isKnight = true;
	} else if ( t === 1 ) {
		this.anim1.data = ad[2];
		this.width = this.height = 64;
		this.door = true;
	} else {
		this.anim1.data = ad[3];
		this.width = this.height = 64;
		this.pickup = true;
	}
	this.t = t;
};

Knight.prototype = {
	update: function() {
	},
	render: function( c ) {
		if ( !this.dead ) {
			var x1 = this.x + this.lvl.viewport.x;
			if ( this.t > 0 ) {
				this.anim1.render( c, true, x1, this.y );
			} else {
				this.anim1.render( c, true, x1, this.y );
				this.anim2.render( c, true, x1 + 50, this.y - 50 );

				// exit text floating over his head
				c.font = '50px Verdana';
				c.fillStyle = '#fff';
				c.fillText('The End', x1 + 20, this.y - 100 );
			}
		}
	}
};

module.exports = Knight;
