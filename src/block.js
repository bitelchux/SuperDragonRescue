'use strict';

function Block (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.tr = this.tl = this.dead = this.pickup = this.exit = this.pl = this.mb = this.next = this.dest = this.kill = false;
};

module.exports = Block;
