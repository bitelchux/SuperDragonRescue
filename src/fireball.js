'use strict';

var Animation = require('./animation');

function Fireball( l, x, y, vx, vy, sx, sy ) {
	this.lvl = l;
	this.x = x;
	this.y = y;
	this.fb = true; // kill on touch
	this.width = 8 * 4;
	this.height = 8 * 4;
	this.dead = false;
	this.kill = true;
	this.velX = vx;
	this.velY = vy;
	this.sx = sx;
	this.sy = sy;

	// flickering fireball
	var ad = [ 256, 49, 8, 8, 50, 1,
			   264, 49, 8, 8, 50, 0
			 ];
	// spritesheet x offset,
	// spritesheet y offset,
	// spritesheet width,
	// spritesheet height,
	// duration
	// nextframe

	this.anim = new Animation( this.lvl.parent.images[0], ad );
};

Fireball.prototype = {
	update: function() {
		if ( !this.dead ) {
			this.anim.update();
			this.x += this.velX;
			this.y += this.velY;
			this.velX += this.sx;
			this.velY += this.sy;

			// I think this needs work
			if ( this.x < 0 || this.y < 0 || this.y > 800 || this.x > 3000 ) {
				this.dead = true;
			}
		}
	},
	render: function( c ) {
		if ( !this.dead ) {
			var x1 = this.x + this.lvl.viewport.x;
			this.anim.render( c, true, x1, this.y );
		}
	}
};

module.exports = Fireball;
