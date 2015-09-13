(function() {
    'use strict';

    var kb = require('./keyboard');
    var ts = require('./textscreen');
    var lev = require('./level');

    var game = null;

    // the game states
    var LOADING = 0;
    var TITLE = 1;
    var INIT = 2;
    var GAME = 3;

    var Game = function() {

      var self = this;

      this.images = [];

      var canvas = document.querySelector('#g');
      this.ctx = canvas.getContext('2d');

      // Don't you dare AntiAlias the pixelart!
      this.ctx.imageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = this.ctx.oImageSmoothingEnabled = false;

      this.gameSize = { 'width': canvas.width, 'height': canvas.height };

      this.state = LOADING;
      this.keyboarder = new kb();

      // set up 3 text screens: loading, title and game over
      this.loadingScreen = new ts( this, '#000', ['Loading...']);
      this.titleScreen = new ts( this, '#6b036e', ['Super Dragon Rescue', 'made for #js13k', 'Code by', 'madmarcel', 'Art by', 'surt & madmarcel'], 'S', 'start', INIT );

	  // start image loader, once it's done loading, gamestate will progress to title screen
      this.loadImgs();

      var SKIPTICKS = 1000 / 60; // frame rate, 60FPS

      var tick = function() {
          // draw the next frame
          self.render();
          requestAnimationFrame(tick);
        };

        // start the animation loop
        tick();

		var gameStep = function() {
			self.update();
			setTimeout( gameStep, SKIPTICKS ); // process the game logic at a target 60 FPS.
		}
		// start the game loop
		gameStep();
    };

    Game.prototype = {
      'render': function() {
        this.ctx.clearRect(0, 0, this.gameSize.width, this.gameSize.height);
        switch ( this.state ) {
          case LOADING:
              this.loadingScreen.render(this.ctx);
            break;
          case TITLE:
              this.titleScreen.render(this.ctx);
            break;
          case GAME:
            this.level.render(this.ctx);
            break;
        }
      },
      'update': function() {
        switch ( this.state ) {
          case LOADING:
            this.loadingScreen.update();
            break;
          case TITLE:
            this.titleScreen.update();
            break;
          case INIT:
            // setup the game
            this.level = new lev(0, this, false); // real level
            this.state = GAME;
            break;
          case GAME:
            this.level.update();
            break;
        }
      },
      // load our images
      'loadImgs': function(){
            var self = this;
			// all the images we want to load...
            var imageNames = [
                                's'
                              ];

            var check_done = function(count) {
              if ( count >= imageNames.length ) {
				self.titleScreen.lvl = new lev(0, self, true); // dud level - scrolls in background of title screen with no player or monsters
				self.state = TITLE;
              }
            };

        var i_count = 0;
		for ( var i = 0; i < imageNames.length; i++ ) {
            var imageObj = new Image();
            imageObj.onload = function() {
                i_count++;
				check_done(i_count);
            };
            imageObj.src = imageNames[i] + '.png';
            self.images[i] = imageObj;
        }
      }
    };

    // start game when page has finished loading
    window.addEventListener('load', function() {
      game = new Game();
    });
})();
