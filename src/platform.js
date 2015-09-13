'use strict';

var Platform = function( lvl, buffer, w, h, x, y, goesUp ) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.lvl = lvl;
	this.buffer = buffer;
	this.velX = 0;
	this.velY = 0;
	this.speed = 3;
	this.pl = true;
	this.goesUp = goesUp;
};

Platform.prototype = {
	render: function( c, vx ) {
		c.drawImage(this.buffer.b, this.x + vx, this.y );
	},
	update: function() {
		var bl = this.lvl.blockers; //.filter( this.lvl.viewport.vis, this.lvl.viewport );
		bl = bl.filter( function(e){
			return !e.pl;
			}
		);

		for (var i = 0; i < bl.length; i++) {
			var d = this.lvl.player.colCheck( this, bl[i] );

			if ( !this.goesUp ) {
				if (d === 'l' ) {
					this.velX = 1;
				}
				if (d === 'r' ) {
					this.velX = -1;
				}
			} else {
				if (d === 'b' ) {
					this.velY = -1;
				}
				if (d === 't' ) {
					this.velY = 1;
				}
			}
		}

		this.x += this.velX;
		this.y += this.velY;
	},
	// generate the platform image using the specified tileset
	init: function( ts, tilesize, p, tmax ) {
		var rules = [
			[ 23, 3, 23 ],
			[ 23, 22, 23]
		];
		var tiles = [];
		var c = 0;
		tiles.push( rules[ts][0] );
		for (c = 0; c < tmax - 2; c++ ) {
			tiles.push( rules[ts][1] );
		}
		tiles.push( rules[ts][2] );
		var f = true;
		for (c = 0; c < tiles.length; c++ ) {
			this.lvl.drawTile( this.buffer.c, tiles[c], c, 0, f, ts );
			f = false;
		}

		if ( !this.goesUp ) {
			this.velX = 1;
		} else {
			this.velY = 1;
		}
	}
};

module.exports = Platform;
