# JS13KGames Boilerplate - simple platformer

A simple platformer with title screen, sound effects, images and keyboard controls.

Use the arrow keys to make the little dude jump around.

Live demo here:

[platformer demo](https://madmarcel.github.io/js13k-platformer/index.html)

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

