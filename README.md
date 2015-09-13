# JS13KGames Boilerplate - simple platformer

# Super Dragon Rescue

Help Dinky the Dragon rescue his friend Sir Knight from the Fire-breathing Princess!

A simple platformer with sloping floors, generously inspired by Super Mario Bros 2.

Five Levels + an endboss.

Use the arrow keys to move and jump.
Z to pickup and throw crates and monsters.

Collect chillies for extra lives.

Live demo here:

[platformer demo](https://madmarcel.github.io/js13k2015/)

[Level editor](https://madmarcel.github.io/js13k2015/leveleditor/)

## Credits:

Platformer code based on these articles by Loktar:

[Creating a canvas platformer tutorial part one](http://www.somethinghitme.com/2013/01/09/creating-a-canvas-platformer-tutorial-part-one/)

Pixelart by Surt, find the original spritesheet + license details here:

[Twin Dragons spritesheet](http://opengameart.org/content/twin-dragons)

## Installation

Clone the repository, and run this command to install the necessary npm modules

```
npm install
```

## Features

* Advanced build system using [gulp.js](http://gulpjs.com/)
* Bundle your game using [browserify](http://browserify.org/)
* Empower your CSS using [LESS](http://lesscss.org/)
* Lint your JavaScript using [ESLint](http://eslint.org/)
* Minify assets
* Compress as a ZIP archive
* Serve your game during development (live reload)

## Sound Effects

Included sound lib:

[jsfxr](https://github.com/mneubrand/jsfxr)

Make your sound effects here:

[as3sfxr](http://www.superflashbros.net/as3sfxr/)

(Right click on the center sliders and use copy and paste to copy sfx data into your code)

## Gulp Instructions
```
gulp build		build the game
gulp clean		delete generated files
gulp dist       generate archive
gulp serve		launch development server
gulp watch		watch for file changes and rebuild automatically
```

In other words, run this in a terminal:
```
gulp build; gulp serve
```

and then in a second terminal, run:
```
gulp watch
```

Then open up [localhost:3000](http://localhost:3000) in your favourite browser and you're all set!

Any changes to code, css, images, etc will trigger an auto reload of your project in the browser.

When you are ready to submit your project, run

```
gulp dist --prod
```

and your final compressed minified project will be created in dist/js13k-dist.zip
