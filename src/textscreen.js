'use strict';
/*
 *  Renders a text only screen
 *
 *  game         : reference to game
 *  bgcolour     : background colour in hex
 *  text         : array of text, will be rendered centered on screen
 *
 *  optional
 *
 *  key          : key to press to continue to next state
 *  keyword      : word, completes the sentence 'press X to ....'
 *  nextstate    : gamestate to transition to after keypress
 */
var TextScreen = function( g, bgcolour, text, key, keyword, nextstate ) {
	this.height = g.gameSize.height;
	this.width = g.gameSize.width;
	this.halfwidth = this.width / 2;
	this.bgcolour = bgcolour;
	this.text = text;
	this.continueKey = key || null;
	this.keyWord = keyword;
	this.nextstate = nextstate;
	this.g = g;
	this.lvl = null;
	this.d = 1;
	this.ctr = 0;
};

TextScreen.prototype = {
	render: function(c) {

		if ( this.lvl !== null ) {
			this.lvl.render(c);
		}
		// set background colour
		c.fillStyle = this.bgcolour;
		c.globalAlpha = 0.75;
		c.fillRect(262,0, 500, this.height);
		c.globalAlpha = 1.0;
		// set text colour, alignment, size and font
		c.font = '40px Verdana';
		c.textAlign = 'center';
		c.fillStyle = '#FFF';
		// draw the centered lines of text
		var y = 100;
		for (var i = 0; i < this.text.length; i++ ) {
			c.fillText( this.text[i], this.halfwidth, y );
			y+= 40;
			// add a little bit of space for every 2 lines of text, groups it nicely
			if (i % 2 !== 0) {
				y += 30;
			}
			// and draw the text a bit smaller
			c.font = '24px Verdana';
		}

		// display message at bottom of screen if key was specified
		if ( this.continueKey !== null ) {
			c.fillText('Press ' + this.continueKey + ' to ' + this.keyWord, this.halfwidth, this.height - 80 );
		}
	},
	update: function() {
		// has user pressed specified key?
		if ( this.continueKey !== null && this.g.keyboarder.isDown( this.continueKey ) ) {
			// yup, advance to next game state
			this.g.state = this.nextstate;
		}
		// little bit of polish - scroll our random level in the background
		if ( this.lvl !== null ) {
			this.lvl.update();
			this.lvl.move( this.d );
			this.ctr++;
			if ( this.ctr > 1200 ) {
				if ( this.d < 0 ) {
					this.lvl.next();
				}
				this.d = this.d * -1;
				this.ctr = 0;
			}
		}
	}
};

module.exports = TextScreen;
