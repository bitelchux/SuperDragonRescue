'use strict';

var Animation = require('./animation');

function Blob( l, x, y, alt, t ) {

	/* types:
	 *
	 * 0 - blob - default
	 * 1 - turtle
	 * 2 - crate
	 * 3 - box
	 */

	this.lvl = l;
	this.x = x;
	this.y = y;
	this.width = 16 * 4;
	this.height = 16 * 4;

	this.velX = 0;
	this.velY = 0;
	this.speed = 0.5;
	this.gravity = 0.9;
	this.friction = 0.9;

	this.goingLeft = this.dead = false;
	this.isMonster = this.grounded = true;
	this.harmless = false;

	// blob frames
	var animData = [
			112, 32, 16, 16, 300, 1,
			128, 32, 16, 16, 300, 2,
			144, 32, 16, 16, 300, 3,
			160, 32, 16, 16, 300, 4,
			144, 32, 16, 16, 300, 5,
			128, 32, 16, 16, 300, 0
	];
	var sh = [ 160, 32, 16, 16, 300, 4 ]; // carry frame - as in, specific sprite for when this thing is carried

	// this.isTurtle = isTurtle;
	this.t = t;
	// turtle
	if (t === 1) {
		animData = [
			176, 32, 16, 16, 400, 1,
			192, 32, 16, 16, 400, 0
		];
		sh = [ 208, 32, 16, 16, 1000, 0 ];
		this.speed = 0.25;
	}
	if (t === 2) { // crate
		this.harmless = true;
		this.speed = 0;
		animData = sh = [ 48, 48, 16, 16, 1000, 0];
	}
	if (t === 3) { // barrel
		this.harmless = true;
		this.speed = 0;
		animData = sh = [ 48, 32, 16, 16, 1000, 0];
	}

	// alt colour version of turtle and blob
	if ( t < 2 && alt ) {
		for (var c = 1; c < animData.length; c += 6 ) {
			animData[c] += 16;
		}
		sh[1] += 16;
	}
	this.anim = new Animation( this.lvl.parent.images[0], animData );
	this.shan = new Animation( this.lvl.parent.images[0], sh );

	// blockers
	this.blo = [];

	this.state = 0;
	this.grabbed = false;
	// unique id
	this.id = this.guid();
};

Blob.prototype = {
	// generate a unique id for each monster - so that we can distinguish from self in filters
	guid: function() {
		var s4 = function() {
		  return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	},
	update: function() {

		if ( this.dead ) {
			// we're dead, so keep falling until we hit bottom edge of screen
			if ( this.y < 800 ) {
				this.velX = 2;
				if ( this.goingLeft ) {
					this.velX = -2;
				}
				this.velY = 15;
				this.y += this.velY;
				this.x += this.velX;
			}
			return;
		}

		if ( this.state === 1 ) {
			// grabbed - don't do much
		} else {
			// normal

			// turtle & blob - walking walking
			if ( this.t < 2 ) {
				if (this.goingLeft ) {
					if (this.velX > -this.speed) {
						this.velX--;
					}
				} else {
					if (this.velX < this.speed) {
						this.velX++;
					}
				}
			}

			this.velX *= this.friction;
			this.velY += this.gravity;
			this.grounded = false;

			var bl = this.blo;

			var ignoreY = -1;

			// need to reverse our loop if we are going left
			if ( this.goingLeft ) {
				bl.reverse();
			}
			// if throwing state, need to ignore the player and monsterblockers here
			if ( this.state > 0 ) {
				bl = bl.filter(function(el){
						return !el.isPlayer && !el.mb;
					}
				);
			}

			var pl = this.lvl.player;

			for (var i = 0; i < bl.length; i++) {

				if ( bl[i].y !== ignoreY ) {

					var dir = pl.colCheck(this, bl[i]);

					// we were chucked into another monster
					if ( dir !== null && this.state === 2 && bl[i].isMonster && !bl[i].harmless ) {
						if ( !bl[i].isBoss ) {
							// whatever we hit is dead
							bl[i].dead = true;
						} else {
							// the boss just registers a hit though
							bl[i].hit();
						}
						// oh, we're dead too.
						this.dead = true;
					}
					// switch back to normal state if we hit terrain or crates etc
					if ( dir !== null ) {
						this.state = 0;
						this.grabbed = false;
					}

					if ( dir === 'l' || dir === 'r' ) {

						if ( !pl.onSlope( bl[i], this ) ) {
							this.velX = 0;
							// turn the other way
							if ( !this.harmless ) {
								this.goingLeft = !this.goingLeft;
							}
						} else {
							ignoreY = bl[i].y;
						}
					} else if (dir === 'b') {
						if ( !pl.onSlope( bl[i], this ) ) {
							this.grounded = true;
							// move on platforms
							if ( bl[i].pl && this.velX < 0.2 ) {
								this.x += bl[i].velX * 2;
							}
						} else {
							ignoreY = bl[i].y;
						}
					}
				}
			}

			if (this.grounded){
				this.velY = 0;
				this.state = 0;
			}

			// can't go past start or end of level
			if ( (this.x + this.velX) > 0.0  && (this.x + this.width + this.velX) < this.lvl.width) {
				this.x += this.velX;
			}
			this.y += this.velY;
		}
		this.anim.update();
	},
	render: function( c ) {

		var x1 = this.x + this.lvl.viewport.x;
		if ( this.y < 800 ) {
			if ( this.state > 0 ) {
				this.shan.render( c, this.goingLeft, x1, this.y );
			} else {
				this.anim.render( c, this.goingLeft, x1, this.y );
			}
		}
	},
	blockfilter: function( r ) {

		// we don't care about hitting these things
		if ( r.exit || r.pickup || r.next || r.dest || r.isPlayer ) {
			return false;
		}

		// if self - ignore as well, otherwise monsters fly off like rockets :)
		if ( r.id && r.id === this.id ) {
			return false;
		}

		return true;
	},
	grab: function() {
		this.state = 1;
		this.grabbed = true;
	},
	chuck: function( vx, vy ) {
		this.state = 2;
		this.velX = 10;
		if ( vx > 0.3 || vx < -0.3 ) {
			this.velX = 25;
		}
		if ( this.goingLeft ) {
			this.velX *= -1;
		}
		this.velX += vx;
		this.velY = -6 + vy;
	}
};

module.exports = Blob;
