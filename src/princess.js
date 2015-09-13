'use strict';

var Animation = require('./animation');
var Fireball = require('./fireball');

function Princess( l, x, y ) {
	this.lvl = l;
	this.x = x;
	this.y = y;
	this.width = 21 * 4;
	this.height = 17 * 4;

	this.velX = 0;
	this.speed = 1;
	this.friction = 0.5;

	this.goingLeft = false;
	this.dead = false;
	this.kill = true;
	this.isMonster = true;
	this.isBoss = true;
	this.health = 3;

	var ad = [
		[
			256, 32, 21, 17, 300, 0 // body
		],
		[
			277, 32, 28, 26, 300, 0  // normal head
		],
		[
			305, 32, 28, 29, 1000, 1,   //firebreathing head
			277, 32, 28, 26, 1000, 0
		],
		[
			371, 32, 20, 20, 2000, 0    // hurt
		]
	];
	// spritesheet x offset,
	// spritesheet y offset,
	// spritesheet width,
	// spritesheet height,
	// duration
	// nextframe

	this.anim = { 'bd': new Animation( this.lvl.parent.images[0], ad[0] ), // body
				  'w': new Animation( this.lvl.parent.images[0], ad[1] ), // walk head
				  'b':  new Animation( this.lvl.parent.images[0], ad[2] ), // breath head
				  'h':  new Animation( this.lvl.parent.images[0], ad[3] ) // hurt head
				};
	this.blo = []; // blockers
	this.c = 'w'; // current animation, either w or b
	this.ho = {
		'b': [ -12, -20 ],
		'w': [ -12, -20 ],
		'h': [ -12, -12 ]
	}; // head offset
	this.s = 'w';                   // state, either shooting, walking, paused
	this.tl = false;                // has touched the left monsterblock
	this.st(); 						// set timestamp
};

Princess.prototype = {
	update: function() {

		if ( this.dead && this.y < 1000) {
			// she's dead, so drop princess off screen
			this.y += this.velY;
			this.x += this.velX;
		} else {
			if ( this.s === 'h' ) { // hurt
				if (this.gt() - this.ts > 500 ) {
					this.s = 'w';
				}
			// walk left and right and shoot when we hit the left monsterblocker
			} else if ( this.s === 'w' ) {
				if (this.goingLeft ) {
					if (this.velX > -this.speed) {
						this.velX--;
					}
				} else {
					if (this.velX < this.speed) {
						this.velX++;
					}
				}

				this.velX *= this.friction;

				var bl = this.blo;
				var pl = this.lvl.player;

				for (var i = 0; i < bl.length; i++) {
						var dir = pl.colCheck(this, bl[i]);
						if ( dir === 'l' || dir === 'r' ) {

							if ( this.goingLeft && this.s === 'w' && this.tl ) {
								this.s = 's';
								this.c = 'b';
							} else {
								this.velX = 0;
								this.goingLeft = !this.goingLeft;
								if ( dir === 'r' ) {
									this.tl = true;
								}
							}
						}
				}

				this.x += this.velX;
			} else if (this.s === 'p') {
				// paused
				if ( this.gt() - this.ts > 2000 ) {
					this.st();
					this.s = 'w';
					this.c = 'w';
				}
			} else {
				if ( this.gt() - this.ts > 100 && this.anim[this.c].c === 0) {
					this.shootFireball();
					this.st();
					this.s = 'p'; // paused
					this.tl = false;
				}
			}
			this.anim[this.c].update();
		}
	},
	render: function( c ) {
		// draw body
		var l = this.goingLeft;
		var x1 = this.x + this.lvl.viewport.x;
		this.anim['bd'].render( c, l, x1, this.y );
		// draw big head
		this.anim[this.c].render( c, l, x1 + this.ho[this.c][(this.goingLeft ? 0: 1)], this.y - 96 );
		// hurt - draw ouch face
		if ( this.s === 'h' ) {
			this.anim[this.s].render( c, l, x1 + this.ho[this.s][(this.goingLeft ? 0: 1)] + 12, this.y - 96 + 20 );
		}
	},
	blockfilter: function( r ) {

		if ( r.isMonster || r.fb ) {
			return false;
		}
		return true;
	},
	shootFireball: function() {
		var f = [ -1, 0, -0.2, -0.2,
				  -1, 0, -0.2, -0.1,
				  -1, 0, -0.2, 0.2,
				  -1, 0, -0.2, 0.0,
				  -1, 0, -0.2, 0.1
				 ];
		for (var p = 0; p < f.length; p += 4) {
			var b = new Fireball( this.lvl, this.x, this.y - 8, f[p], f[p + 1], f[p + 2], f[p + 3] );
			this.lvl.things.push( b );
			this.lvl.blockers.push( b );
		}
	},
	hit: function() {
		this.health -= 1;
		this.s = 'h'; // hurt
		this.c = 'w';
		this.st(); // set timestamp
		if ( this.health < 1) {
			this.dies();
		}
	},
	st: function() {
		this.ts = this.gt();
	},
	gt: function() {
		return new Date().getTime();
	},
	dies: function() {
		this.dead = true;
		this.velX = 0.75;
		this.velY = 8;

		// she's dead Jim - so open the brick wall door
		var l = this.lvl.things;
		// clear the walls
		for ( var i = 0; i < l.length; i++ ) {
			if ( l[i].door ) {
				l[i].dead = true;
			}
		}
	}
};

module.exports = Princess;
