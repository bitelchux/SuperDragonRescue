'use strict';

var Animation = require('./animation');

function Player( game, x, y, viewport ) {
	this.lives = 3;
	this.chi = 0;
	this.game = game;
	this.viewport = viewport;
	this.x = x;
	this.y = y;
	this.width = 16 * 4;
	this.height = 16 * 4;
	this.boxes = [];
	this.isPlayer = true;

	this.mx = this.x + this.width / 2;
	this.by = this.y + this.height;

	this.velX = 0;
	this.velY = 0;
	this.speed = 5;
	this.jumping = false;
	this.gravity = 0.2;
	this.grounded = true;
	this.friction = 0.9;

	this.goingLeft = false;
	this.vx = 0;

	//this.ss = null;
	this.onPlatform = false;
	this.holding = null;

	var adb = [
				[ 16, 32, 16, 8, 1000, 0 ], // idle
				[ 16, 40, 16, 8, 200, 1,
				  15, 48, 16, 8, 200, 2,
				  16, 56, 16, 8, 200, 3,
				  32, 32, 16, 8, 200, 0
				 ], // walking
				[33, 40, 15, 14, 1000, 0] // jumping

			  ];
	var adh = [
				 [ 0, 32, 16, 11, 400, 0 ], // idle
				 [ 0, 54, 16, 11, 400, 0 ], // walking
				 [ 32,54, 16, 11, 400, 0 ], // jumping
				 [ 347, 49, 25, 16, 1000, 0],  // ouch bubble
				 [ 240, 48, 16,16, 1000, 0] // chilli
			  ];
	// spritesheet x offset,
	// spritesheet y offset,
	// spritesheet width,
	// spritesheet height,
	// duration
	// nextframe

	// using third param for body offset
	this.ho = [ [ -12, 12, 0 ], // idle
			    [ -12, 12, 0 ], // walking,
				[ -12, 12, -16 ] // jumping
			   ];

	this.cba = 0; // current body animation
	this.cha = 0; // current head animation

	this.ab = [ new Animation( this.game.images[0], adb[0] ),  // idle body
			    new Animation( this.game.images[0], adb[1] ),  // walking
				new Animation( this.game.images[0], adb[2] )   // jumping
			  ];
	this.ah = [ new Animation( this.game.images[0], adh[0] ),  // idle head
			    new Animation( this.game.images[0], adh[1] ),  // walking head
				new Animation( this.game.images[0], adh[2] ),  // jumping head
				new Animation( this.game.images[0], adh[4] ) // chilli

			  ];
	this.ouch = new Animation( this.game.images[0], adh[3] );

	this.release = true;
};

Player.prototype = {
	died: function() {
		this.lives -= 1;
		this.dead = true;
	},
	render: function(c) {

		var x1 = this.x + this.viewport.x;

		this.ab[this.cba].render( c, this.goingLeft, x1, this.y + 32 + this.ho[this.cha][2] );
		this.ah[this.cha].render( c, this.goingLeft, x1 + this.ho[this.cha][(this.goingLeft ? 0: 1)], this.y - 12);

		if ( this.dead ) {
			this.ouch.render( c, true, x1 + 40, this.y - 84 );

			if ( this.y >= 790 ) {
				// draw a black box with restart message and lives left

				// black box
				c.fillStyle = '#000';
				c.globalAlpha = 0.75;
				c.fillRect(262, 200, 500, 250);
				c.globalAlpha = 1.0;
				// set text colour, alignment, size and font
				c.textAlign = 'center';
				c.fillStyle = '#fff';

				c.font = '35px Verdana';
				if ( this.lives > 0 ) {
					// head x lives left
					//this.ah[0].render( c, false, 440, 270);
					//c.fillText( 'x ' + this.lives, 550, 310 );
					this.drwLvs( c, 440, 270, 0, this.lives );
				} else {
					// game over text
					c.fillText( 'Game Over!', 512, 310 );
				}

				// continue text
				c.font = '22px Verdana';
				c.fillText( 'Press R to continue', 512, 400 );
			}
		}

		// draw hud
		this.drawHud(c);
	},
	drawHud: function(c) {
		this.drwLvs(c, 10, 10, 0, this.lives);
		this.drwLvs(c, 10, 60, 3, this.chi);
	},

	drwLvs: function(c, x, y, t, e) {
		c.font = '35px Verdana';
		this.ah[t].render( c, false, x, y);
		c.fillText( 'x ' + e, x + 110, y + 40 );
	},
	onSlope: function( b, s ) {

		// bug - can't jump straight up while on a slope :(
		if ( b.tr || b.tl ) {

			var bottomX = b.x;
			var bottomY = b.y + b.height;
			if ( b.tr ) {

				// y1 = y + (x1 - x)
				var newY = Math.floor(bottomY - ((s.x + s.width / 2) - bottomX));

				// s.py = newY;

				if ( s.y >= newY - s.height ) {
					s.y = newY - s.height;
					s.velY = 0;
					s.grounded = true;
					s.jumping = false;
					this.cba = 1;
					this.cha = 1;

				}
			} else if ( b.tl ) {

				// y1 = y + (v - (x1 - x))
				var newY = Math.floor(bottomY - ( b.height - ((s.x + s.width / 2) - bottomX)));

				if ( s.y >= newY - s.height ) {
					s.y = newY - s.height;
					s.velY = 0;
					s.grounded = true;
					s.jumping = false;
					this.cba = 1;
					this.cha = 1;
				}
			}

			return true;
		}
		return false;
	},
	update: function() {
		var k = this.game.keyboarder;
		if ( this.dead ) {
			if ( this.y < 800 ) {
				this.velX = 0;
				this.velY = 8;
				this.y += this.velY;
				this.cba = 2;
				this.cha = 2;
				this.ab[this.cba].update();
				this.ah[this.cha].update();
				return;
			} else {
				if (k.isDown('R')) {
					if ( this.lives > 0 ) {
						// this.lives -= 1;
						this.game.level.restart(this);
					} else {
						// back to title screen
						this.game.state = 1;
					}
				}
			}
		}
		// left
		if (k.isDown('LEFT')) {
			if (this.velX > -this.speed) {
				this.velX--;
				if ( this.grounded ) {
					this.cba = 1;
					this.cha = 1;
				} else {
					this.cba = 2;
					this.cha = 2;
				}
			}
            this.goingLeft = true;
        }
		// right
		if (k.isDown('RIGHT')) {
			if (this.velX < this.speed) {
				this.velX++;
				if ( this.grounded ) {
					this.cba = 1;
					this.cha = 1;
				} else {
					this.cba = 2;
					this.cha = 2;
				}
			}
            this.goingLeft = false;
        }
		// jump
		if (k.isDown('SPACE') || k.isDown('UP') ) {
			if (!this.jumping && this.grounded){
				this.jumping = true;
				this.grounded = false;
				this.velY = -this.speed * 2;
				this.cba = 2;
				this.cha = 2;
			}
        }
		// grab and throw stuff
		// we need to track button state here, otherwise player will pickup and chuck stuff immediately.
		if (k.isUp('Z') ) {
			this.release = true;
		}
		if (k.isDown('Z') ) {

			if ( this.holding !== null && this.release ) {
				// throw it if we're holding it
				this.holding.chuck( this.velX, this.velY );
				this.holding = null;
			} else if ( this.holding === null ) {
				if ( !this.jumping && this.grounded ) {
					// grab something if we're standing on it.

					var bl = this.game.level.blockers.filter( this.viewport.vis, this.viewport );
					bl = bl.filter(function(el){
							return !el.dead && el.isMonster && !el.boss;
						}
					);

					this.y += 1;
					for (var i = 0; i < bl.length; i++) {
						// console.log( bl[i] );
						var dir = this.colCheck(this, bl[i]);
						// console.log( dir );
						if (dir === 'b') {
							this.holding = bl[i];
							bl[i].grab();
							this.release = false;
							break;
						}
					}
				}
			}
		}

		this.velX *= this.friction;
        this.velY += this.gravity;
		this.grounded = false;

		var bl = this.game.level.blockers.filter( this.viewport.vis, this.viewport );
		bl = bl.filter(function(el){
				return !el.dest && !el.mb && !el.dead && !el.grabbed;
			}
		);

		// use this to ignore blocks on same y level as slopes
		var ignoreY = -1;

		// need to reverse our loop if we are going left
		if ( this.goingLeft ) {
			bl.reverse();
		}

		for (var i = 0; i < bl.length; i++) {

			// console.log( ignoreY );
			if ( bl[i].y !== ignoreY ) {

				var dir = this.colCheck(this, bl[i]);

				if ( (dir === 'l' || dir === 'r') && !bl[i].pickup ) {

					if ( !this.onSlope( bl[i], this ) ) {
						this.velX = 0;
						this.jumping = false;
					} else {
						ignoreY = bl[i].y;
					}
				} else if (dir === 'b' && !bl[i].pickup) {
					if ( !this.onSlope( bl[i], this ) ) {

						// this odd line allows the player to jump when he's on a vertical platform
						if ( this.onPlatform && this.jumping && this.velY < 0 ) {
						} else {
							this.grounded = true;
							this.jumping = false;
						}
						this.onPlatform = false;

						// is the player standing on a horizontally moving platform or monster?
						if ( ((bl[i].pl && !bl[i].goesUp) || bl[i].isMonster) && this.velX < 0.2 ) {
							this.x += bl[i].velX * 2;
							this.viewport.x -= bl[i].velX * 2;
							this.game.level.move( bl[i].velX * 2 );
							this.onPlatform = true;
						}
						// is player standing on vertically moving platform?
						if ( bl[i].pl && bl[i].goesUp ) {
							this.onPlatform = true;
						}

					} else {
						ignoreY = bl[i].y;
					}
				} else if (dir === 't' && !bl[i].pickup) {
					this.velY *= -1;
				}
				if ( dir !== null && bl[i].kill ) {
					// console.log('you died!');
					// this.dead = true;
					this.died();
				}
				if ( dir !== null && dir !== 'b' && bl[i].isMonster && !bl[i].harmless) {
					// console.log('The monster killed you!');
					this.dead = true;
					this.died();
				}
				if ( dir !== null && bl[i].exit ) {
					this.game.level.next(this);
				}
				if ( dir !== null && bl[i].isKnight ) {
					this.game.state = 1; // title screen
				}
				// pickup a bonus
				if ( dir !== null && bl[i].pickup) {
					this.chi += 1;
					bl[i].dead = true;
					if ( this.chi > 2 ) {
						this.lives += 1;
						this.chi -= 3;
					}
				}
				if ( dir !== null && bl[i].next ) {
					// this.game.level.next();
					var ob = this.game.level.blockers;
					for (var o = 0; o < ob.length; o++ ) {
						if ( ob[o].dest ) {
							this.y = ob[o].y;

							var delta = ((ob[o].x * -1) - this.viewport.x) + 512;

							this.x -= delta;
							this.viewport.x += delta;
							this.game.level.move( delta * -1 );
							break;
						}
					}
				}
			}
		}

		if (this.grounded && !this.jumping ){
            this.velY = 0;
			this.cba = 1;
			this.cha = 1;
        }

		if ( !this.grounded && (this.velY > 0.2 || this.velY < -0.2 ) && !this.onPlatform ) { // && this.jumping) {
			this.cba = 2;
			this.cha = 2;
		}

		// check if player is in the 'deadzone'
		if ( this.x + this.viewport.x >= this.viewport.minXmove && this.x + this.viewport.x <= this.viewport.maxXmove ) {
			// do nuthing
		} else {
			// player is in left zone and moving right, do nuthing
			if ( this.x + this.viewport.x <= this.viewport.minXmove && this.velX > 0 ) {
				// do nuthing
			} else if ( this.x + this.viewport.x >= this.viewport.maxXmove && this.velX < 0 ) {
				// do nuthing
			} else {
				if ( Math.abs(this.viewport.x - this.game.gameSize.width) >= this.game.level.width - this.velX && this.velX > 0 ) {
					// do nuthing
				} else if ( this.viewport.x - this.velX > 0.0 && this.velX < 0 ) {
					// do nuthing
				} else {
					this.viewport.x -= this.velX;
					this.game.level.move( this.velX );
				}
			}
		}

		// can't walk past start or end of level
		if ( (this.x + this.velX) > 0.0  && (this.x + this.width + this.velX) < this.game.level.width) {
			this.x += this.velX;
		}
        this.y += this.velY;

		if ( this.velX < 0.4 && this.velX > -0.4 && this.grounded ) {
			this.cba = 0;
			this.cha = 0;
			//this.velX = 0;
			//console.log( this.velX );
		}

		if ( this.y > 770 && !this.dead ) {
			// this.dead = true;
			this.died();
		}

		this.ab[this.cba].update();
		this.ah[this.cha].update();

		if ( this.holding !== null ) {
			this.holding.x = this.x;
			this.holding.y = this.y - this.holding.height;
			this.holding.goingLeft = this.goingLeft
		}
	},
	colCheck: function( shapeA, shapeB ) {
		if ( shapeB.dead ) {
			return null;
		}
		// get the vectors to check against
        var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
            vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.width / 2) + (shapeB.width / 2),
            hHeights = (shapeA.height / 2) + (shapeB.height / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = 't';
					// lots of exceptions here
					if ( !shapeB.tr && !shapeB.tl && !shapeB.pickup && !( shapeA.pl && shapeB.isMonster )) {
						shapeA.y += oY;
					}
                } else {
					colDir = 'b';
					// monsters ignore monster blockers if they fall on them.
					if ( !shapeB.tr && !shapeB.tl && !shapeB.pickup && !( shapeA.pl && shapeB.isMonster ) && !(shapeA.isMonster && shapeB.mb)) {
						shapeA.y -= oY;
					}
                }
            } else {
				// forgive left and forgive width
				var fgl = 20, fgw = fgl * 2;
				// default square based collision is too unforgiving for player vs monster collision
				if ( (shapeA.isPlayer && shapeB.isMonster && !shapeB.harmless) ) {
					hWidths = ((shapeA.width - fgw) / 2) + ((shapeB.width - fgw) / 2),
					vX = ((shapeA.x + fgl) + ((shapeA.width - fgw) / 2)) - ((shapeB.x + fgl) + ((shapeB.width - fgw) / 2));

					if ( vX > 0 && vX < 35 ) {
						return 'l';
					}
					if ( vX < 0 && vX > -35 ) {
						return 'r';
					}
					return null;
				}

                if (vX > 0) {
					colDir = 'l';
					// need to make sure monsters don't push the boxes away here
					if ( !shapeB.tr && !shapeB.tl && !shapeB.pickup && !(( shapeA.pl || (shapeA.harmless && !shapeB.harmless) ) && shapeB.isMonster ) ) {
						shapeA.x += oX;
					}
                } else {
					colDir = 'r';
					if ( !shapeB.tr && !shapeB.tl && !shapeB.pickup && !(( shapeA.pl || (shapeA.harmless && !shapeB.harmless )) && shapeB.isMonster ) ) {
						shapeA.x -= oX;
					}
                }
            }
        }
        return colDir;
	}
};

module.exports = Player;
