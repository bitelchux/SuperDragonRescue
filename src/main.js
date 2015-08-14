(function() {
    'use strict';
    var game = null;
    // audio
    var audio = null;
    // images
    var images = [];

    var getTimeStamp = function() {
        return Date.now();
    };

    var Game = function() {

      var canvas = document.querySelector('#game');
      var ctx = canvas.getContext('2d');

      var gameSize = { 'width': canvas.width, 'height': canvas.height };

      this.state = 'LOADING';
      this.keyboarder = new Keyboarder();
      this.player = new Player(this, gameSize);

      audio = new ArcadeAudio();

      // pickup item sound
      audio.add( 'pickup', 2,
          [
              [0,,0.01,0.4394,0.3103,0.8765,,,,,,0.3614,0.5278,,,,,,1,,,,,0.5]
          ]
      );

      // start image loader, once it's done loading, gamestate will progress to title screen
      this.loadImages();

      var SKIPTICKS = 1000 / 60; // frame rate

      var nextFrame = getTimeStamp();
      var loops = 0;

      var tick = function() {
          loops = 0;
          // frame rate independent game speed
          while ( getTimeStamp() > nextFrame && loops < 10 ) {
              // update the game state
              self.update();
              nextFrame += SKIPTICKS;
              loops++;
          }
          // draw the next frame
          self.render();

          requestAnimationFrame(tick);
        };

        // start the animation loop
        tick();
    };

    Game.prototype = {
      'render': function() { 

      },
      'update': function() {

      },
      // load our spritesheet
      'loadImages': function(){
            var self = this;
            var imageObj = new Image();

            imageObj.onload = function() {
                self.state = 'TITLE';
            };
            imageObj.src = 'spritesheet.png';
            images[0] = imageObj;
        }
    };

    // start game when page has finished loading
    window.addEventListener('load', function() {
      game = new Game();
    });
})();

/*

*/
